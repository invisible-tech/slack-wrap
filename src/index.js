'use strict'

const appModulePath = require('app-module-path')

appModulePath.addPath(`${__dirname}/..`)
appModulePath.enableForDir(`${__dirname}`)

module.exports = require('./slack')
