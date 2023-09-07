import { Socket } from 'net'
import Action from '../models/action.model.js'
import Product from '../models/product.model.js'
import logger from '../../config/logger.js'

export type QueuesType = {
  buyQueue: Product[]
  sellQueue: Product[]
}

/**
 * Socket data handler
 * @public
 */
export const dataHandler = ({
  data,
  currentSocket,
  socketsList,
  buyQueue,
  sellQueue,
}: {
  data: Buffer
  currentSocket: Socket
  socketsList: Socket[]
  buyQueue: Product[]
  sellQueue: Product[]
}): QueuesType => {
  const handleBuyOfferAdd = (product: Product) => {
    sendAcknowledgeToSocket(product)
    logger.info(`new buy order ('${currentSocket.remotePort}', ${product})`)
    return [...buyQueue, product]
  }

  const handleSellOfferAdd = (product: Product) => {
    sendAcknowledgeToSocket(product)
    logger.info(`new sell order ('${currentSocket.remotePort}', ${product})`)
    return [...sellQueue, product]
  }

  const sendTradeNotification = (product: Product) => {
    socketsList.forEach((socket) =>
      socket.write(`${Action.Trade}:${product}\n`)
    )
  }

  const updateQueuesForBuyOffer = (
    product: Product,
    updatedBuyQueue: string[]
  ) => {
    const indexInSellQueue = sellQueue.indexOf(product)
    if (indexInSellQueue > -1) {
      sendTradeNotification(product)
      logger.info(`trade (${product})`)
      return {
        sellQueue: sellQueue.filter(
          (product, index) => index !== indexInSellQueue
        ),
        buyQueue: updatedBuyQueue.slice(0, -1) as Product[],
      }
    }
    return { buyQueue: updatedBuyQueue as Product[], sellQueue }
  }

  const updateQueuesForSellOffer = (
    product: Product,
    updatedSellQueue: string[]
  ) => {
    const indexInBuyQueue = buyQueue.indexOf(product)
    if (indexInBuyQueue > -1) {
      sendTradeNotification(product)
      logger.info(`trade (${product})`)
      return {
        buyQueue: buyQueue.filter(
          (product, index) => index !== indexInBuyQueue
        ),
        sellQueue: updatedSellQueue.slice(0, -1) as Product[],
      }
    }
    return { buyQueue, sellQueue: updatedSellQueue as Product[] }
  }

  const sendAcknowledgeToSocket = (product: Product) =>
    currentSocket.write(`${Action.Acknowledge}:${product}\n`)

  // Prepare matcher for regexp
  const validProductsMatcher = Object.values(Product).reduce(
    (accumulator: string, currentValue) => {
      return accumulator === ''
        ? currentValue
        : `${accumulator}|${currentValue}`
    },
    ''
  )

  // Remove LFs and convert Buffer to string
  const stringifiedBufferNoLineFeed = data
    .filter((char) => char !== 0x0a)
    .toString()

  const [offerType, product] = stringifiedBufferNoLineFeed.split(':')

  // Check if request is valid
  if (
    !new RegExp(
      `(${Action.Buy}|${Action.Sell}):(${validProductsMatcher})`
    ).test(stringifiedBufferNoLineFeed)
  ) {
    if (stringifiedBufferNoLineFeed) {
      logger.error(
        `wrong instruction ${currentSocket.remoteAddress} ${currentSocket.remotePort}`
      )
    }
    return {
      buyQueue,
      sellQueue,
    }
  }

  if (offerType === Action.Buy) {
    const updatedBuyQueue = handleBuyOfferAdd(product as Product)
    return updateQueuesForBuyOffer(product as Product, updatedBuyQueue)
  } else if (offerType === Action.Sell) {
    const updatedSellQueue = handleSellOfferAdd(product as Product)
    return updateQueuesForSellOffer(product as Product, updatedSellQueue)
  }

  return {
    buyQueue,
    sellQueue,
  }
}
