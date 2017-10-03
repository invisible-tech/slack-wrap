'use strict'

const assert = require('assert')

const overrideProxy = require('src/helpers/overrideProxy')

describe('helpers/overrideProxy', () => {
  const setup = () => {
    const obj = {
      a: 1,
      b: 2,
      c: {
        d: 4,
        e: {
          f: 6,
          h: 8,
        },
      },
    }

    const overrides = {
      a: 11,
      c: {
        e: {
          f: 'deep override',
          g: 'this key does\'t exist on the original',
        },
      },
      h: 'this key also doesn\'t exist on the original',
    }

    const wrapped = overrideProxy({ obj, overrides })
    return { wrapped }
  }

  it('should return the default value if no override exists', () => {
    const { wrapped } = setup()
    assert.strictEqual(wrapped.b, 2)
    assert.strictEqual(wrapped.c.d, 4)
    assert.strictEqual(wrapped.c.e.h, 8)
  })

  it('should return the override value if it exists', () => {
    const { wrapped } = setup()
    assert.strictEqual(wrapped.a, 11)
    assert.strictEqual(wrapped.c.e.f, 'deep override')
    assert.strictEqual(wrapped.c.e.g, 'this key does\'t exist on the original')
    assert.strictEqual(wrapped.h, 'this key also doesn\'t exist on the original')
  })

  it('should return undefined if no override nor default exists', () => {
    const { wrapped } = setup()
    assert.strictEqual(undefined, wrapped.asdf)
  })
})

