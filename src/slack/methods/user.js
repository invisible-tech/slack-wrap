'use strict'

const {
  find,
  get,
} = require('lodash/fp')

/**
 * Returns the posting params, given a Slack User id
 * @method getPostingParams
 * @param {Object} slack - The wrapped slack
 * @param {String} options.userId - The Slack User ID like U012345
 * @return {Object} - An object of the form { username, icon_url }
 */
const getPostingParams = slack =>
  async userId => {
    const info = await slack.users.info({ user: userId })
    return {
      as_user: false,
      username: get('user.profile.real_name')(info),
      icon_url: get('user.profile.image_48')(info),
    }
  }

/**
 * Returns a Slack User that matches the given query
 *
 * @method getUser
 * @param {Object} slack - The wrapped slack
 * @param {String} query - The query object like { name: slackUsername }
 *   or { id: 'U01234'}
 * @return {Object} - A Slack User object as returned by the API, or undefined
 *   if no User matches the query
 */
const getUser = slack =>
  async query => {
    const users = get('members')(await slack.users.list())
    return find(query)(users)
  }

module.exports = {
  getPostingParams,
  getUser,
}
