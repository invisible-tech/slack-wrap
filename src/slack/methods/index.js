'use strict'

/**
 * @file Contains extra methods for our Slack Wrapper. All methods take a slack
 *   object via dependency injection.
 */

const channels = require('./channels')
const files = require('./files')
const message = require('./message')

module.exports = {
  ...channels,
  ...files,
  ...message,
}
