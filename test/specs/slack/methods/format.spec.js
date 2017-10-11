'use strict'

const assert = require('assert')
const chance = require('@invisible/chance-extras')
const {
  replace,
} = require('lodash/fp')

const {
  getChannelLink,
  getMessageLink,
  getUserLink,
} = require('src/slack/methods/format.js')

describe('slack/methods/format', () => {
  describe('getChannelLink', () => {
    it('should return the channel link', () => {
      const channelId = chance.slackChannelId()

      const actual = getChannelLink({ channelId })

      const expected = `<#${channelId}>`
      assert.strictEqual(expected, actual)
    })

    it('should return the channel link with display', () => {
      const channelId = chance.slackChannelId()
      const display = chance.uniqueWord()

      const actual = getChannelLink({ channelId, display })

      const expected = `<#${channelId}|${display}>`
      assert.strictEqual(expected, actual)
    })
  })

  describe('getMessageLink', () => {
    it('should return the message link', () => {
      const teamName = chance.uniqueWord()
      const channelId = chance.slackChannelId()
      const ts = chance.slackTs()

      const actual = getMessageLink({ teamName, channelId, ts })

      const tsWithoutDot = replace('.')('')(ts)
      const expected = `<https://${teamName}.slack.com/archives/${channelId}/p${tsWithoutDot}>`
      assert.strictEqual(expected, actual)
    })

    it('should return the message link with display', () => {
      const teamName = chance.uniqueWord()
      const channelId = chance.slackChannelId()
      const ts = chance.slackTs()
      const display = chance.uniqueWord()

      const actual = getMessageLink({ teamName, channelId, ts, display })

      const tsWithoutDot = replace('.')('')(ts)
      const expected = `<https://${teamName}.slack.com/archives/${channelId}/p${tsWithoutDot}|${display}>`
      assert.strictEqual(expected, actual)
    })
  })

  describe('getUserLink', () => {
    it('should return the user link', () => {
      const userId = chance.slackUserId()

      const actual = getUserLink({ userId })

      const expected = `<@${userId}>`
      assert.strictEqual(expected, actual)
    })

    it('should return the user link with display', () => {
      const userId = chance.slackUserId()
      const display = chance.uniqueWord()

      const actual = getUserLink({ userId, display })

      const expected = `<@${userId}|${display}>`
      assert.strictEqual(expected, actual)
    })
  })
})
