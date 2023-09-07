import { Socket } from 'net'
import logger from '../../config/logger.js'

/**
 * Socket end handler
 * @public
 */
export const endHandler = (currentSocket: Socket, socketsList: Socket[]) => {
  logger.info(
    `connection closed ${currentSocket.remoteAddress} ${currentSocket.remotePort}`
  )
  return socketsList.filter((socket) => socket !== currentSocket)
}
