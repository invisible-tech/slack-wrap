'use strict'

const avow = require('avow')

const destructuredArgsProxy = require('~/src/helpers/destructuredArgsProxy')

describe('helpers/destructuredArgsProxy', () => {
  const setup = () => {
    const obj = {
      a: (b, c, d) => `${b} ${c} ${d}`,
      b: {
        nested: (b, c, d) => `${b} ${c} ${d}`,
      },
      withOpts: (a, b, opts, c) => `${a} ${b} ${c} ${opts.hello}`,
      noChange: ({ a, b, c }) => `${a} ${b} ${c}`,
    }
    const proxy = destructuredArgsProxy(obj)
    return { obj, proxy }
  }

  it('should properly transform methods to use destructured args', async () => {
    const { obj, proxy } = setup()
    avow.strictEqual(
      obj.a('b', 'c', 'd'),
      proxy.a({ b: 'b', c: 'c', d: 'd' })
    )
  })

  it('should transform methods that are deeply nested to use destructured args', async () => {
    const { obj, proxy } = setup()
    avow.strictEqual(
      obj.b.nested('b', 'c', 'd'),
      proxy.b.nested({ b: 'b', c: 'c', d: 'd' })
    )
  })

  it('should transform methods that have an "opts" parameter', async () => {
    const { obj, proxy } = setup()
    avow.strictEqual(
      obj.withOpts('a', 'b', { hello: 'there' }, 'c'),
      proxy.withOpts({ a: 'a', b: 'b', c: 'c', hello: 'there' })
    )
  })

  it('should not affect methods that already take destructured args', async () => {
    const { obj, proxy } = setup()
    avow.strictEqual(
      obj.noChange({ a: 'a', b: 'b', c: 'c' }),
      proxy.noChange({ a: 'a', b: 'b', c: 'c' })
    )
  })
})
