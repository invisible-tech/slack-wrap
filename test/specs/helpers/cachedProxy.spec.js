'use strict'

const avow = require('avow')
const timekeeper = require('timekeeper')

const cachedProxy = require('src/helpers/cachedProxy')
const {
  CACHE_TTL,
  GLOBAL_CACHE,
} = require('src/helpers/cachedFn')

describe('helpers/cachedProxy', () => {
  const setup = () => {
    const now = new Date().getTime()
    const fn = () => new Date().getTime()
    timekeeper.freeze(now)
    return { fn, now }
  }

  afterEach(() => {
    timekeeper.reset()
    GLOBAL_CACHE.clear()
  })

  it('should not cache methods that are not passed in as cachedPaths', async () => {
    const { fn, now } = setup()
    const proxy = cachedProxy({ obj: { fn } })

    timekeeper.freeze(now + (CACHE_TTL / 2))

    avow.notStrictEqual(now, proxy.fn())
  })

  it('should cache the method that is passed in as cachedPaths, and within the TTL', async () => {
    const { fn, now } = setup()
    const proxy = cachedProxy({ cachedPaths: [{ path: 'fn' }], obj: { fn } })

    const expected = proxy.fn()

    timekeeper.freeze(now + (CACHE_TTL / 2))
    avow.strictEqual(expected, proxy.fn())
  })

  it('should not return the cached result if outside the TTL', async () => {
    const { fn, now } = setup()
    const proxy = cachedProxy({ cachedPaths: [{ path: 'fn' }], obj: { fn } })

    timekeeper.freeze(now + (CACHE_TTL / 2))

    avow.notStrictEqual(now, proxy.fn())

    timekeeper.freeze(now + (CACHE_TTL + 1000))
    avow.notStrictEqual(now, proxy.fn())
  })

  it('should work when given ttl in cachedPaths', async () => {
    const { fn, now } = setup()
    const ttl = 1234
    const proxy = cachedProxy({ cachedPaths: [{ path: 'fn', ttl }], obj: { fn } })
    const result1 = proxy.fn()

    timekeeper.freeze(now + (ttl / 2))
    const result2 = proxy.fn()
    avow.strictEqual(result1, result2)

    timekeeper.freeze(now + ttl + 100000)
    const result3 = proxy.fn()
    avow.notStrictEqual(result1, result3)
  })

  it('should keep caches separate for different cachedProxies', async () => {
    const { fn, now } = setup()

    const proxy1 = cachedProxy({ cachedPaths: [{ path: 'fn' }], obj: { fn } })
    const proxy2 = cachedProxy({ cachedPaths: [{ path: 'fn' }], obj: { fn } })

    const result11 = proxy1.fn()
    timekeeper.freeze(now + 10)
    const result21 = proxy2.fn()
    timekeeper.freeze(now + 20)
    const result12 = proxy1.fn()
    const result22 = proxy2.fn()

    avow.strictEqual(result11, result12)
    avow.strictEqual(result21, result22)
    avow.notStrictEqual(result11, result21)
  })
})
