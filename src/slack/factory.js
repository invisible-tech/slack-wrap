'use strict'

const { WebClient } = require('@slack/client')
const {
  find,
  flow,
  get,
  mapValues,
} = require('lodash/fp')

const cachedProxy = require('src/helpers/cachedProxy')
const destructuredArgsProxy = require('src/helpers/destructuredArgsProxy')
const overrideProxy = require('src/helpers/overrideProxy')

// Keep global array of slack clients here, indexed by token and teamId
const slacks = []

/**
 * Returns a wrapped Slack Web Client based on the access token OR the Slack Team ID
 *   if it exists in the global cache. Returned undefined otherwise
 * @method getSlack
 * @private
 * @param {String} options.accessToken - the Slack access token, like xoxp-2114...
 * @param {String} options.teamId - the Slack Team ID, like T0ABC...
 * @return {Object} - The wrapped Slack Web Client
 */
const getSlack = ({ accessToken, teamId }) => {
  if (teamId && flow(find({ teamId }), get('slack'))(slacks)) {
    return flow(find({ teamId }), get('slack'))(slacks)
  }

  if (accessToken && flow(find({ accessToken }), get('slack'))(slacks)) {
    return flow(find({ accessToken }), get('slack'))(slacks)
  }
  return undefined
}

const addMethods = ({ accessToken, slack, teamId, methods = false }) => {
  const getTeamId = () => teamId
  const getAccessToken = () => accessToken
  const scopedMethods = methods ? mapValues(fn => fn(slack))(methods.scopedMethods) : {}

  return {
    getTeamId,
    getAccessToken,
    ...methods.unscopedMethods,
    ...scopedMethods,
  }
}

/**
 * Creates a wrapped Slack Web Client
 * @method factory
 * @param {String} options.accessToken - The Oauth token from Slack
 * @param {String} options.teamId - The team ID from Slack
 * @param {Array<Object>} options.cachedPaths - Optional: An array of the paths to the methods
 *   to cache with an optional ttl
 * @param {Object} options.methods - Optional: if none passed in, will use default extra
 *   methods in ./methods
 * @return {Object} - The wrapped Slack Web Client
 */
const factory = ({ accessToken, teamId, cachedPaths = false, methods = false } = {}) => {
  const existing = getSlack({ accessToken, teamId })
  if (existing) return existing

  const unwrapped = accessToken ?
    new WebClient(accessToken) :
    new WebClient()

  // All methods should accept destructured args
  const destructured = destructuredArgsProxy(unwrapped)

  // Cached methods should be replaced with the cached versions
  const cached = cachedProxy({ obj: destructured, cachedPaths })

  // Add our custom methods
  const newMethods = addMethods({
    accessToken,
    slack: cached,
    methods: methods || require('./methods'),
    teamId,
  })

  const slack = overrideProxy({ obj: cached, overrides: newMethods })

  // Add to the global array of Slack Web clients
  slacks.push({ accessToken, slack, teamId })
  return slack
}

module.exports = factory
