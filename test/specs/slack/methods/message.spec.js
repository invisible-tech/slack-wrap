'use strict'

const avow = require('avow')
const sinon = require('sinon')
const chance = require('@invisible/chance-extras')
const {
  find,
  get,
  keys,
  map,
} = require('lodash/fp')

const channelsHistoryFixture = require('../../../fixtures/channels.history.json')
const channelsHistoryFixture2 = require('../../../fixtures/channels.history2.json')
const { getMessage } = require('../../../../src/slack/methods/message')

describe('slack/methods/message', () => {
  describe('getMessage', () => {
    const setup = () => {
      const channels = {
        [chance.slackChannelId()]: channelsHistoryFixture,
        [chance.slackChannelId()]: channelsHistoryFixture2,
      }

      const historyStub = sinon.stub().callsFake(async ({ channel, latest }) => {
        const fixture = channels[channel]
        const messages = get('messages')(fixture)
        const message = find({ ts: latest })(messages)
        return { messages: [ message ] }
      })

      const slack = {
        channels: {
          history: historyStub,
        },
      }
      return {
        channels,
        slack,
      }
    }

    it('should get the correct message', async () => {
      const { channels, slack } = setup()
      const channelId = chance.pickone(keys(channels))
      const fixture = channels[channelId]
      const messages = get('messages')(fixture)
      const ts = chance.pickone(map('ts')(messages))

      const expected = find({ ts })(messages)
      const actual = await getMessage(slack)({ channelId, ts })

      avow.deepStrictEqual(expected, actual)
    })
  })
})
