'use strict'

const avow = require('avow')

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
    avow.strictEqual(wrapped.b, 2)
    avow.strictEqual(wrapped.c.d, 4)
    avow.strictEqual(wrapped.c.e.h, 8)
  })

  it('should return the override value if it exists', () => {
    const { wrapped } = setup()
    avow.strictEqual(wrapped.a, 11)
    avow.strictEqual(wrapped.c.e.f, 'deep override')
    avow.strictEqual(wrapped.c.e.g, 'this key does\'t exist on the original')
    avow.strictEqual(wrapped.h, 'this key also doesn\'t exist on the original')
  })

  it('should return undefined if no override nor default exists', () => {
    const { wrapped } = setup()
    avow.strictEqual(undefined, wrapped.asdf)
  })
})

