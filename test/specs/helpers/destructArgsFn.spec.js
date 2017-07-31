'use strict'

require('~/test/testHelper')

const avow = require('avow')

const {
  destructArgsFn,
  _test: { objArgsToArray },
} = require('~/src/helpers/destructArgsFn')

describe('destructArgsFn', () => {
  describe('objArgsToArray', () => {
    it('should return the correct array when no opts', async () => {
      const params = ['a', 'b', 'c']
      const obj = { c: 1, a: 2, b: 3 }
      avow.deepStrictEqual(objArgsToArray({ obj, params }), [2, 3, 1])
    })

    it('should ignore unrecognized params when no opts', async () => {
      const params = ['a', 'b', 'c']
      const obj = { c: 1, a: 2, b: 3, d: 4, e: 5 }
      avow.deepStrictEqual(objArgsToArray({ obj, params }), [2, 3, 1])
    })

    it('should return the correct array when params contains opts', async () => {
      const params = ['a', 'opts', 'b', 'c']
      const obj = { c: 1, a: 2, b: 3, d: 4, e: 5 }
      avow.deepStrictEqual(objArgsToArray({ obj, params }), [2, { d: 4, e: 5 }, 3, 1])
    })
  })

  describe('destructArgsFn', () => {
    it('should return the same function if it already accepts one object as argument', async () => {
      const objFn = ({ d, e }) => `${e} ${d}`
      const args = { d: 1, e: 2 }
      const expected = objFn(args)
      avow.strictEqual(destructArgsFn({ fn: objFn }), objFn)
      avow.strictEqual(destructArgsFn({ fn: objFn })(args), expected)
    })

    it('should work when opts is present', async () => {
      const fnWithOpts = (a, b, c, opts) => `${a} ${b} ${c} ${opts.thing}`
      const actual = destructArgsFn({ fn: fnWithOpts })({ a: 1, b: 2, c: 3, thing: 'a', ignored: 5 })
      const expected = '1 2 3 a'
      avow.strictEqual(actual, expected)
    })

    it('should work when opts is not present', async () => {
      const fn = (a, b, c) => `${a} ${b} ${c}`
      const actual = destructArgsFn({ fn })({ a: 1, b: 2, c: 3, thing: 'a', ignored: 5 })
      const expected = '1 2 3'
      avow.strictEqual(actual, expected)
    })

    it('should work when parent is passed in', async () => {
      function fn(a, b, c) {
        return `${this.thing} ${a} ${b} ${c}`
      }
      const actual = destructArgsFn({ fn, parent: { thing: 'hi' } })({ a: 1, b: 2, c: 3 })
      const expected = 'hi 1 2 3'
      avow.strictEqual(actual, expected)
    })
  })
})
