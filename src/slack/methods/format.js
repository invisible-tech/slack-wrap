'use strict'

const { oneLineTrim } = require('common-tags')
const { replace } = require('lodash/fp')

const channelLink = ({ channelId, display }) =>
  (display
    ? `<#${channelId}|${display}>`
    : `<#${channelId}>`)

const removeDot = replace('.')('')
const messageLink = ({ teamName, channelId, ts, display }) =>
  (display
    ? oneLineTrim`<https://${teamName}.slack.com/archives/
        ${channelId}/p${removeDot(ts)}|${display}>`
    : oneLineTrim`<https://${teamName}.slack.com/archives/
        ${channelId}/p${removeDot(ts)}>`)

const userLink = ({ userId, display }) =>
  (display
    ? `<@${userId}|${display}>`
    : `<@${userId}>`)

module.exports = {
  channelLink,
  messageLink,
  userLink,
}
