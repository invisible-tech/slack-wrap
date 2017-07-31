'use strict'

const {
  forEach,
} = require('lodash/fp')

const avow = require('avow')

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
