'use strict'

/**
 * @file Contains extra methods for our Slack Wrapper. All methods take a slack
 *   object via dependency injection.
 */

const message = require('./message')

module.exports = {
  ...message,
}
