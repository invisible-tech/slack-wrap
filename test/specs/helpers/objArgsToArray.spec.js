'use strict'

const assert = require('@invisible/assert')

const objArgsToArray = require('../../../src/helpers/objArgsToArray')

describe('objArgsToArray', () => {
  const testObj = { c: 'huh', a: 'wat', b: 'cool', d: 'stuff', e: 'things' }

  it('should return the correct array when no opts', async () => {
    const params = ['a', 'b', 'c']
    const obj = { c: 'da', a: 'la', b: 'di' }
    assert.deepStrictEqual(objArgsToArray({ obj, params }), ['la', 'di', 'da'])
  })

  it('should merge unexpected params when params contains opts', async () => {
    const params = ['a', 'opts', 'b', 'c']
    const actual = objArgsToArray({ obj: testObj, params })
    const expected = ['wat', { d: 'stuff', e: 'things' }, 'cool', 'huh']
    assert.deepStrictEqual(actual, expected)
  })

  it('should ignore unexpected params when no opts', async () => {
    const params = ['a', 'b', 'c']
    const actual = objArgsToArray({ obj: testObj, params })
    const expected = ['wat', 'cool', 'huh']
    assert.deepStrictEqual(actual, expected)
  })

  it('should treat missing params as undefined empty', async () => {
    const params = ['a', 'b', 'c']
    const actual = objArgsToArray({ obj: undefined, params })
    const expected = [undefined, undefined, undefined]
    assert.deepStrictEqual(actual, expected)
  })
})
