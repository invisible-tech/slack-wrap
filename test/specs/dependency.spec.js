'use strict'

const {
  forEach,
} = require('lodash/fp')

const assert = require('@invisible/assert')
const path = require('path')
const recursiveReaddir = require('recursive-readdir')

const ROOT_DIR = path.join(__dirname, '../..')

describe('dependencies', () => {
  let jsFiles
  before(done => {
    const ignore = (filename, stats) => ! (/\.js$/.test(filename)) && ! stats.isDirectory()
    recursiveReaddir(path.join(ROOT_DIR, '/src'), [ignore], (err, files) => {
      jsFiles = files

      describe('dependencies', () => {
        forEach(filename =>
          it(`should be able to require ${filename.substring(ROOT_DIR.length)}`, () => {
            require(filename)
          }))(files)
      })

      done()
    })
  })

  it('should have found some files', () =>
    assert(jsFiles.length > 0, 'no files found!'))
})
