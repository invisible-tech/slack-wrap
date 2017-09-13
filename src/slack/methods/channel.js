'use strict'

const avow = require('avow')
const { oneLine } = require('common-tags')
const {
  find,
  get,
  includes,
} = require('lodash/fp')

/**
 * Returns a Channel object, given a query (e.g. searching by channel name or id).
 * Returns the cached Channel if it is cached, hits the API if channel list cache is empty.
 * Returns undefined if no Channels match the query.
 * Note: will return undefined if the channel list cache is present, but does not contain
 *   a Channel matching the query.
 *
 * @method getCachedChannel
 * @param {Object} slack - The wrapped slack
 * @param {Object} query - The query object, like { name: 'dms-jarvis-tony' }
 *   or { id: 'C012345' }
 * @return {Object} - A Slack Channel object or undefined if none match the query
 */
const getCachedChannel = slack =>
  async query => {
    const result = await slack.channels.list()
    const channels = get('channels')(result)
    return find(query)(channels)
  }

/**
 * Returns a Channel object, given a query (e.g. searching by channel name or id).
 * Returns the cached Channel if it is cached, clears the entire API cache and
 *   hits the API if it is not found. Throws an error if no Channels match the query.
 *
 * @method getChannel
 * @param {Object} slack - The wrapped slack
 * @param {Object} query - The query object, like { name: 'dms-jarvis-tony' }
 *   or { id: 'C012345' }
 * @return {Object} - A Slack Channel object or throws an error
 */
const getChannel = slack =>
  async query => {
    let channel = await slack.getCachedChannel(query)
    if (channel) return channel
    slack.getCache().clear()
    channel = await slack.getCachedChannel(query)
    avow(channel, oneLine`Could not find channel ${JSON.stringify(query)}
      for team ${slack.getTeamId()}`)
    return channel
  }

/**
 * Gets a channel by name, or creates it if it doesn't exist.
 *
 * @method upsertChannel
 * @param {Object} slack - The wrapped slack
 * @param {String} options.name - The channel name
 * @return {Object} - The slack channel object as returned by the API
 */
const upsertChannel = slack =>
  async ({ name }) => {
    const query = { name }
    try {
      const channel = await slack.getChannel(query)
      return channel
    } catch (err) {
      // TODO: only catch channel not found errs
      const response = await slack.channels.create({ name })
      return get('channel')(response)
    }
  }

/**
 * Upserts a channel (by name) and invites the given user (by Slack User ID)
 *
 * @method upsertChannelAndInvite
 * @param {Object} slack - The wrapped slack
 * @param {String} options.name - The channel name
 * @param {String} options.slackUserId - The Slack User ID like 'U012345'
 * @return {Object} - The slack channel object as returned by the API
 */
const upsertChannelAndInvite = slack =>
  async ({ name, slackUserId }) => {
    const channel = await slack.upsertChannel({ name })
    if (includes(slackUserId)(get('members')(channel))) return channel
    return get('channel')(await slack.channels.invite({
      channel: channel.id,
      user: slackUserId,
    }))
  }

module.exports = {
  getChannel,
  getCachedChannel,
  upsertChannel,
  upsertChannelAndInvite,
}
