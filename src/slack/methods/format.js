'use strict'

const { oneLineTrim } = require('common-tags')
const { replace } = require('lodash/fp')

const getChannelLink = ({ channelId, display }) =>
  (display
    ? `<#${channelId}|${display}>`
    : `<#${channelId}>`)

const removeDot = replace('.')('')
const getMessageLink = ({ teamName, channelId, ts, display }) =>
  (display
    ? oneLineTrim`<https://${teamName}.slack.com/archives/
        ${channelId}/p${removeDot(ts)}|${display}>`
    : oneLineTrim`<https://${teamName}.slack.com/archives/
        ${channelId}/p${removeDot(ts)}>`)

const getUserLink = ({ userId, display }) =>
  (display
    ? `<@${userId}|${display}>`
    : `<@${userId}>`)

module.exports = {
  getChannelLink,
  getMessageLink,
  getUserLink,
}
