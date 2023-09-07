import net from 'net'
import config from './config/vars.js'
import logger from './config/logger.js'
import { errorHandler } from './api/handlers/error.js'
import { endHandler } from './api/handlers/end.js'
import { dataHandler } from './api/handlers/data.js'
import store from './api/store/store.js'

const server = net.createServer((socket) => {
  logger.info(`connected '${socket.remoteAddress}' ${socket.remotePort}`)
  store.socketsList = [...store.socketsList, socket]

  socket.on('end', () => {
    store.socketsList = endHandler(socket, store.socketsList)
  })

  socket.on('error', (error: Error & { code: string }) => {
    store.socketsList = errorHandler(error, socket, store.socketsList)
  })

  socket.on('data', (data) => {
    const { buyQueue, sellQueue } = dataHandler({
      data,
      currentSocket: socket,
      socketsList: store.socketsList,
      buyQueue: store.buyQueue,
      sellQueue: store.sellQueue,
    })
    store.buyQueue = buyQueue
    store.sellQueue = sellQueue
  })
})

// listen on configured port
server.listen(config.port, () =>
  logger.info(`listening on port ${config.port}`)
)

export default server
