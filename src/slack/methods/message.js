'use strict'

const assert = require('assert')
const {
  first,
} = require('lodash/fp')

/**
 * Returns a Message object, given a Slack Channel ID and a timestamp.
 *
 * @method getMessage
 * @param {Object} slack - The wrapped slack
 * @param {String} options.channelId - The Slack Channel ID like 'C012345'
 * @param {String} options.ts - The unix timestamp with microsecond precision
 *   (like '1499718817.760039'). This is the format returned by Slack's API
 * @return {Object} - A Slack Message object as returned by the API, or throws if
 *   the channel is not found, or the ts is invalid
 */
const getMessage = async function ({ channelId, ts }) {
  assert(ts, 'no ts given')
  const response = await this.channels.history({
    channel: channelId,
    inclusive: true,
    latest: ts,
    oldest: ts,
    count: 1,
  })
  return first(response.messages)
}

module.exports = {
  getMessage,
}
