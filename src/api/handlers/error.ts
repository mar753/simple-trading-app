import { Socket } from 'net'
import logger from '../../config/logger.js'

/**
 * Socket error handler
 * @public
 */
export const errorHandler = (error: Error & {code: string}, currentSocket: Socket, socketsList: Socket[]) => {
  if (error.code === 'ECONNRESET') {
    logger.info(`disconnected ${currentSocket.remoteAddress} ${currentSocket.remotePort}`)
    return socketsList.filter((socket) => socket !== currentSocket)
  }
  throw error
}
