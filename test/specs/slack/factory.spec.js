'use strict'

const avow = require('avow')
const chance = require('@invisible/chance-extras')

const factory = require('../../../src/slack/factory')

describe('slack/factory', () => {
  const setup = () => ({
    accessToken: chance.slackOauthToken(),
    teamId: chance.slackTeamId(),
  })

  it('should work when no arguments passed in', async () => {
    const slack = factory()
    avow.strictEqual(slack.getAccessToken(), undefined)
    avow.strictEqual(slack.getTeamId(), undefined)
  })

  describe('should return cached client', () => {
    it('when given existent accessToken', async () => {
      const { accessToken, teamId } = setup()
      const slack = factory({ accessToken, teamId })
      const _slack = factory({ accessToken })

      avow.strictEqual(slack.getAccessToken(), accessToken)
      avow.strictEqual(slack.getTeamId(), teamId)
      avow.strictEqual(slack.getAccessToken(), _slack.getAccessToken())
      avow.strictEqual(slack.getTeamId(), _slack.getTeamId())
    })

    it('when given existent teamId', async () => {
      const { accessToken, teamId } = setup()
      const slack = factory({ accessToken, teamId })
      const _slack = factory({ teamId })

      avow.strictEqual(slack.getAccessToken(), accessToken)
      avow.strictEqual(slack.getTeamId(), teamId)
      avow.strictEqual(slack.getAccessToken(), _slack.getAccessToken())
      avow.strictEqual(slack.getTeamId(), _slack.getTeamId())
    })

    it('when given no accessToken nor teamId', async () => {
      const slack = factory()
      const _slack = factory()

      avow.strictEqual(slack.getAccessToken(), undefined)
      avow.strictEqual(slack.getTeamId(), undefined)
      avow.strictEqual(slack.getAccessToken(), _slack.getAccessToken())
      avow.strictEqual(slack.getTeamId(), _slack.getTeamId())
    })
  })
})
