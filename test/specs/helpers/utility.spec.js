'use strict'

const assert = require('@invisible/assert')

const {
  isTestEnv,
  exportForTest,
} = require('src/helpers/utility')

describe('helpers/utility', () => {
  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  describe('isTestEnv', () => {
    it('should return true if in test env', async () => {
      process.env.NODE_ENV = 'test'
      assert(isTestEnv())
    })

    it('should return false if not in test env', async () => {
      process.env.NODE_ENV = 'development'
      assert(! isTestEnv())
    })
  })

  describe('exportForTest', () => {
    const setup = () => {
      const stuff = 'hi'
      const stuff2 = 'thing'

      const theModule = {}

      theModule.exports = {
        stuff,
      }
      return { stuff, stuff2, theModule }
    }

    it('should merge given functions to module.exports when in test env', async () => {
      const { stuff, stuff2, theModule } = setup()

      process.env.NODE_ENV = 'test'
      exportForTest(theModule, { stuff2 })

      assert.deepStrictEqual(theModule.exports, { stuff, stuff2 })
    })

    it('should ignore extra exports when not in test env', async () => {
      const { stuff, stuff2, theModule } = setup()

      process.env.NODE_ENV = 'development'
      exportForTest(theModule, { stuff2 })

      assert.deepStrictEqual(theModule.exports, { stuff })
    })
  })
})
