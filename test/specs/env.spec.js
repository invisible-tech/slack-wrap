'use strict'

const avow = require('avow')
const {
  forEach,
} = require('lodash/fp')

require('~/test/testHelper')

const envVars = [
  'LOG_LEVEL',
  'NODE_ENV',
]

describe('envVars', () => {
  forEach(name => {
    it(name, () => {
      avow.notEqual(process.env[name], null, `${name} is not set`)
    })
  })(envVars)
})
