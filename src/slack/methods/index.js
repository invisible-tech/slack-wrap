'use strict'

/**
 * @file Contains methods for our Slack Wrapper. All methods take a slack object
 *   via dependency injection
 */

const channel = require('./channel')
const file = require('./file')
const message = require('./message')
const user = require('./user')

module.exports = {
  ...channel,
  ...file,
  ...message,
  ...user,
}
