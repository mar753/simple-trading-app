import { Socket } from 'net'
import { endHandler } from '../handlers/end.js'

jest.mock('winston', () => ({
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(() => '111111'),
    combine: jest.fn(),
  },
  transports: { File: jest.fn(), Console: jest.fn() },
  createLogger: jest.fn(() => ({ add: jest.fn(), info: jest.fn() })),
}))

test('Should return filtered socketList', () => {
  const socketMock = { remoteAddress: 'localhost', remotePort: 2345 } as Socket
  expect(endHandler(socketMock, [socketMock])).toHaveLength(0)
})
