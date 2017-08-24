'use strict'

const avow = require('avow')

const objArgsToArray = require('../../../src/helpers/objArgsToArray')

describe('objArgsToArray', () => {
  const testObj = { c: 'huh', a: 'wat', b: 'cool', d: 'stuff', e: 'things' }

  it('should return the correct array when no opts', async () => {
    const params = ['a', 'b', 'c']
    const obj = { c: 'da', a: 'la', b: 'di' }
    avow.deepStrictEqual(objArgsToArray({ obj, params }), ['la', 'di', 'da'])
  })


  it('should merge unexpcted params when params contains opts', async () => {
    const params = ['a', 'opts', 'b', 'c']
    const actual = objArgsToArray({ obj: testObj, params })
    const expected = ['wat', { d: 'stuff', e: 'things' }, 'cool', 'huh']
    avow.deepStrictEqual(actual, expected)
  })

  it('should ignore unexpcted params when no opts', async () => {
    const params = ['a', 'b', 'c']
    const actual = objArgsToArray({ obj: testObj, params })
    const expected = ['wat', 'cool', 'huh']
    avow.deepStrictEqual(actual, expected)
  })
})
