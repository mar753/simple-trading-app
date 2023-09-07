import { Socket } from 'net'
import { errorHandler } from '../handlers/error.js'

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
  expect(
    errorHandler(
      { code: 'ECONNRESET' } as Error & { code: string },
      socketMock,
      [socketMock]
    )
  ).toHaveLength(0)
})
