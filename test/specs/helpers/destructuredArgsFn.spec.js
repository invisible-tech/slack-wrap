'use strict'

require('~/test/testHelper')

const avow = require('avow')

const destructuredArgsFn = require('../../../src/helpers/destructuredArgsFn')

describe('destructuredArgsFn', () => {
  const testObject = {
    a: 'hey',
    b: 'ho',
    c: 'lets',
    thing: 'go',
    ignored: 'fuuuuuuuu',
  }

  it('should return the same function if it already accepts one object as argument', async () => {
    const objFn = ({ d, e }) => `${e} ${d}`
    const args = { d: 1, e: 2 }
    const expected = objFn(args)
    avow.strictEqual(destructuredArgsFn({ fn: objFn }), objFn)
    avow.strictEqual(destructuredArgsFn({ fn: objFn })(args), expected)
  })

  it('should work when opts is present', async () => {
    const fnWithOpts = (a, b, c, opts) => `${a} ${b} ${c} ${opts.thing}`
    const actual = destructuredArgsFn({ fn: fnWithOpts })(testObject)
    const expected = 'hey ho lets go'
    avow.strictEqual(actual, expected)
  })

  it('should work when opts is not present', async () => {
    const fn = (a, b, c) => `${a} ${b} ${c}`
    const actual = destructuredArgsFn({ fn })(testObject)
    const expected = 'hey ho lets'
    avow.strictEqual(actual, expected)
  })

  it('should bind method correctly when context is passed in', async () => {
    function fn(a, b, c) {
      return `${a} ${b} ${c} ${this.thing}`
    }
    const context = { thing: 'we can do what we want' }
    const actual = destructuredArgsFn({ fn, context })({ a: 'It\'s', b: 'our', c: 'party' })
    const expected = 'It\'s our party we can do what we want'
    avow.strictEqual(actual, expected)
  })
})
