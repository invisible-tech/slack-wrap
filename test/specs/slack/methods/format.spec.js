'use strict'

const assert = require('assert')
const chance = require('@invisible/chance-extras')
const {
  replace,
} = require('lodash/fp')

const {
  channelLink,
  messageLink,
  userLink,
} = require('src/slack/methods/format.js')

describe('slack/methods/format', () => {
  describe('channelLink', () => {
    it('should return the channel link', () => {
      const channelId = chance.slackChannelId()

      const actual = channelLink({ channelId })

      const expected = `<#${channelId}>`
      assert.strictEqual(expected, actual)
    })

    it('should return the channel link with display', () => {
      const channelId = chance.slackChannelId()
      const display = chance.uniqueWord()

      const actual = channelLink({ channelId, display })

      const expected = `<#${channelId}|${display}>`
      assert.strictEqual(expected, actual)
    })
  })

  describe('messageLink', () => {
    it('should return the message link', () => {
      const teamName = chance.uniqueWord()
      const channelId = chance.slackChannelId()
      const ts = chance.slackTs()

      const actual = messageLink({ teamName, channelId, ts })

      const tsWithoutDot = replace('.')('')(ts)
      const expected = `<https://${teamName}.slack.com/archives/${channelId}/p${tsWithoutDot}>`
      assert.strictEqual(expected, actual)
    })

    it('should return the message link with display', () => {
      const teamName = chance.uniqueWord()
      const channelId = chance.slackChannelId()
      const ts = chance.slackTs()
      const display = chance.uniqueWord()

      const actual = messageLink({ teamName, channelId, ts, display })

      const tsWithoutDot = replace('.')('')(ts)
      const expected = `<https://${teamName}.slack.com/archives/${channelId}/p${tsWithoutDot}|${display}>`
      assert.strictEqual(expected, actual)
    })
  })

  describe('userLink', () => {
    it('should return the user link', () => {
      const userId = chance.slackUserId()

      const actual = userLink({ userId })

      const expected = `<@${userId}>`
      assert.strictEqual(expected, actual)
    })

    it('should return the user link with display', () => {
      const userId = chance.slackUserId()
      const display = chance.uniqueWord()

      const actual = userLink({ userId, display })

      const expected = `<@${userId}|${display}>`
      assert.strictEqual(expected, actual)
    })
  })
})
