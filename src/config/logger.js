'use strict'

require('dotenv').config({ path: `${__dirname}/../../.env` })
const moment = require('moment')
const winston = require('winston')

const { isTestEnv } = require('~/src/helpers/utility')

const ERROR = 'error'
const WARN = 'warn'
const INFO = 'info'
const VERBOSE = 'verbose'
const DEBUG = 'debug'
const SILLY = 'silly'

const LOG_LEVELS = {
  ERROR,
  WARN,
  INFO,
  VERBOSE,
  DEBUG,
  SILLY,
}

const consoleLoggerOptions = {
  transports: [
    new (winston.transports.Console)({
      timestamp: () => moment().format(),
      formatter: options => {
        const message = options.message
        const meta = options.meta && Object.keys(options.meta).length ? `\n\t ${JSON.stringify(options.meta)}` : ''
        // Return string will be passed to logger.
        const msg = `${options.timestamp()} ${options.level.toUpperCase()} ${message} ${meta}`
        return winston.config.colorize(options.level, msg)
      },
    }),
  ],
}

const logger = new (winston.Logger)(consoleLoggerOptions)

// Remove console logger if in test mode
if (isTestEnv()) logger.remove(winston.transports.Console)
// Defaults logger level to INFO
logger.level = process.env.LOG_LEVEL || INFO

module.exports = {
  logger,
  LOG_LEVELS,
}
