'use strict'

const { oneLineTrim } = require('common-tags')
const { replace } = require('lodash/fp')

const channelLink = function ({ channelId, display }) {
  return (display
    ? `<#${channelId}|${display}>`
    : `<#${channelId}>`)
}

const removeDot = replace('.')('')
const messageLink = function ({ teamName, channelId, ts, display }) {
  return display
    ? oneLineTrim`<https://${teamName}.slack.com/archives/
        ${channelId}/p${removeDot(ts)}|${display}>`
    : oneLineTrim`<https://${teamName}.slack.com/archives/
        ${channelId}/p${removeDot(ts)}>`
}

const userLink = function ({ userId, display }) {
  return display
    ? `<@${userId}|${display}>`
    : `<@${userId}>`
}

module.exports = {
  channelLink,
  messageLink,
  userLink,
}
