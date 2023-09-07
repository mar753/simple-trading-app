import { Socket } from 'net'
import { dataHandler } from '../handlers/data.js'
import Product from '../models/product.model.js'

jest.mock('winston', () => ({
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(() => '111111'),
    combine: jest.fn(),
  },
  transports: { File: jest.fn(), Console: jest.fn() },
  createLogger: jest.fn(() => ({
    add: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  })),
}))

test('Should not make any changes', () => {
  const socketMock = { remoteAddress: 'localhost', remotePort: 2345 } as Socket

  const { buyQueue, sellQueue } = dataHandler({
    data: Buffer.from('abc'),
    currentSocket: socketMock,
    socketsList: [socketMock],
    buyQueue: [Product.Apple],
    sellQueue: [Product.Onion],
  })

  expect(buyQueue).toHaveLength(1)
  expect(buyQueue[0]).toEqual(Product.Apple)
  expect(sellQueue).toHaveLength(1)
  expect(sellQueue[0]).toEqual(Product.Onion)
})

test('Should add buy offer', () => {
  const writeTest = jest.fn()
  const socketMock = {
    remoteAddress: 'localhost',
    remotePort: 2345,
    write: (buffer) => {
      writeTest()
    },
  } as Socket

  const { buyQueue, sellQueue } = dataHandler({
    data: Buffer.from('BUY:ONION'),
    currentSocket: socketMock,
    socketsList: [socketMock],
    buyQueue: [],
    sellQueue: [],
  })

  expect(buyQueue).toHaveLength(1)
  expect(buyQueue[0]).toEqual(Product.Onion)
  expect(sellQueue).toHaveLength(0)
  expect(writeTest).toHaveBeenCalledTimes(1)
})

test('Should add sell offer', () => {
  const writeTest = jest.fn()
  const socketMock = {
    remoteAddress: 'localhost',
    remotePort: 2345,
    write: (buffer) => {
      writeTest()
    },
  } as Socket

  const { buyQueue, sellQueue } = dataHandler({
    data: Buffer.from('SELL:POTATO'),
    currentSocket: socketMock,
    socketsList: [socketMock],
    buyQueue: [],
    sellQueue: [],
  })

  expect(buyQueue).toHaveLength(0)
  expect(sellQueue).toHaveLength(1)
  expect(sellQueue[0]).toEqual(Product.Potato)
  expect(writeTest).toHaveBeenCalledTimes(1)
})

test('Should execute trade', () => {
  const writeTest = jest.fn()
  const socketMock = {
    remoteAddress: 'localhost',
    remotePort: 2345,
    write: (buffer) => {
      writeTest()
    },
  } as Socket

  const { buyQueue, sellQueue } = dataHandler({
    data: Buffer.from('SELL:POTATO'),
    currentSocket: socketMock,
    socketsList: [socketMock],
    buyQueue: [Product.Apple, Product.Potato, Product.Tomato, Product.Tomato],
    sellQueue: [Product.Pear, Product.Pear],
  })

  expect(buyQueue).toHaveLength(3)
  expect(buyQueue[0]).toEqual(Product.Apple)
  expect(buyQueue[1]).toEqual(Product.Tomato)
  expect(buyQueue[2]).toEqual(Product.Tomato)
  expect(sellQueue).toHaveLength(2)
  expect(sellQueue[0]).toEqual(Product.Pear)
  expect(sellQueue[0]).toEqual(Product.Pear)
  expect(writeTest).toHaveBeenCalledTimes(2)
})
