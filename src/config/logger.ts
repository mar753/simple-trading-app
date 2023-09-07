import winston from 'winston'

const winstonFileFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  }
)
const winstonConsoleFormat = winston.format.printf(
  ({ message, timestamp }) => {
    return `${timestamp.substring(11, 19)} ${message}`
  }
)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winstonFileFormat
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winstonConsoleFormat
      ),
    })
  )
}

logger.stream = {
  write: (message: string) => {
    logger.info(message.trim())
  },
} as any

export default logger
