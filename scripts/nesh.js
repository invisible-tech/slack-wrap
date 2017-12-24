'use strict'

const appModulePath = require('app-module-path')

appModulePath.addPath(process.cwd())
require('dotenv').config()
