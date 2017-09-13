'use strict'

const avow = require('avow')
const chance = require('@invisible/chance-extras')
const {
  find,
  get,
} = require('lodash/fp')

const {
  getChannel,
  getCachedChannel,
  upsertChannel,
  upsertChannelAndInvite,
} = require('~/src/slack/methods/channel')

const channelsListFixture = require('~/test/fixtures/channels.list.json')

const sinon = require('sinon')

const setup = () => {
  const teamId = chance.slackTeamId()
  const slack = {
    channels: {
      list: sinon.stub().resolves(channelsListFixture),
      info: sinon.stub().callsFake(async id =>
        find({ id })(get('channels')(channelsListFixture))
      ),
    },
  }

  slack.getCache = getCache(slack)
  slack.getTeamId = () => teamId
  slack.getCachedChannel = getCachedChannel(slack)
  return slack
}


describe('slack/methods/channel', () => {
  describe('getChannel', () => {
    it('should returns a channel by name', async () => {
      const slack = setup()
      const channel = chance.pickone(channelsListFixture.channels)
      const _channel = await getChannel(slack)({ name: channel.name })
      avow.deepStrictEqual(_channel, channel)
    })
  })

  describe('getCachedChannel', () => {
    xit('should work', async () => {
      avow(false)
    })
  })

  describe('upsertChannel', () => {
    xit('should work', async () => {
      avow(false)
    })
  })

  describe('upsertChannelAndInvite', () => {
    xit('should work', async () => {
      avow(false)
    })
  })
})
