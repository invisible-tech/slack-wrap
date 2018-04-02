'use strict'

const assert = require('assert')
const {
  find,
} = require('lodash/fp')

/**
 * Returns a Channel object
 *
 * @method getChannel
 * @param {Object} slack - The wrapped slack
 * @param {String} options.channelId - The Slack Channel ID like 'C012345'
 * @param {String} options.channelName - The Slack Channel Name
 * @return {Object} - return a channel object that is matched to the given
 * channelId or channelName
 */
const getChannel = slack => {
  let channelListCache
  return async ({ channelId, channelName, excludeArchived = true }) => {
    assert(channelId || channelName, 'no channelId or channelName given')

    const findChannel = find(channel =>
      channelId === channel.id || channelName === channel.name
    )

    const cached = findChannel(channelListCache)
    if (cached) return cached

    const response = await slack.channels.list({ exclude_archived: excludeArchived })
    channelListCache = response.channels

    return findChannel(channelListCache)
  }
}

module.exports = {
  getChannel,
}
