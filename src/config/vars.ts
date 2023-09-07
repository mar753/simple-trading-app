import 'dotenv/config'

const config = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 8888,
  morganString:
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',
}

export default config
