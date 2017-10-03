'use strict'

const assert = require('assert')
const chance = require('@invisible/chance-extras')

const factory = require('src/slack/factory')

describe('slack/factory', () => {
  const setup = () => ({
    accessToken: chance.slackOauthToken(),
    teamId: chance.slackTeamId(),
  })

  it('should work when no arguments passed in', async () => {
    const slack = factory()
    assert.strictEqual(slack.getAccessToken(), undefined)
    assert.strictEqual(slack.getTeamId(), undefined)
  })

  describe('should return cached client', () => {
    it('when given existent accessToken', async () => {
      const { accessToken, teamId } = setup()
      const slack = factory({ accessToken, teamId })
      const _slack = factory({ accessToken })

      assert.strictEqual(slack.getAccessToken(), accessToken)
      assert.strictEqual(slack.getTeamId(), teamId)
      assert.strictEqual(slack.getAccessToken(), _slack.getAccessToken())
      assert.strictEqual(slack.getTeamId(), _slack.getTeamId())
    })

    it('when given existent teamId', async () => {
      const { accessToken, teamId } = setup()
      const slack = factory({ accessToken, teamId })
      const _slack = factory({ teamId })

      assert.strictEqual(slack.getAccessToken(), accessToken)
      assert.strictEqual(slack.getTeamId(), teamId)
      assert.strictEqual(slack.getAccessToken(), _slack.getAccessToken())
      assert.strictEqual(slack.getTeamId(), _slack.getTeamId())
    })

    it('when given no accessToken nor teamId', async () => {
      const slack = factory()
      const _slack = factory()

      assert.strictEqual(slack.getAccessToken(), undefined)
      assert.strictEqual(slack.getTeamId(), undefined)
      assert.strictEqual(slack.getAccessToken(), _slack.getAccessToken())
      assert.strictEqual(slack.getTeamId(), _slack.getTeamId())
    })
  })
})
