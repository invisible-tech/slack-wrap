'use strict'

const avow = require('avow')
const memoryCache = require('memory-cache')
const timekeeper = require('timekeeper')
const {
  get,
} = require('lodash/fp')

const {
  CACHE_TTL,
  cacheKey,
  getContextAndFnFromObjPath,
  GLOBAL_CACHE,
  makeCached,
  makeCachedObjPath,
} = require('~/src/helpers/cachedFn')

describe('helpers/cachedFn', () => {
  describe('cacheKey', () => {
    it('should return undefined if no name given', async () => {
      avow.strictEqual(
        cacheKey({ options: { hello: 'there' } }),
        undefined
      )
    })

    it('should return the name if no options given', async () => {
      const name = 'hello.longname'
      avow.strictEqual(
        cacheKey({ name }),
        name
      )
    })

    it('should return the name with options stringified (functions ignored) if options given', async () => {
      const name = 'hello.longname'
      const options = {
        goodbye: { what: 'cool' },
        more: ['a', 'b' ],
        fn: () => 'functions are ignored',
        b: 3,
      }
      avow.strictEqual(
        cacheKey({ name, options }),
        'hello.longname-{"goodbye":{"what":"cool"},"more":["a","b"],"b":3}'
      )
    })
  })

  describe('makeCached', () => {
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

    it('should return the cached result if within the TTL', async () => {
      const { fn, now } = setup()

      const cachedFn = makeCached({ fn })
      const expected = cachedFn()

      timekeeper.freeze(now + (CACHE_TTL / 2)) // cache ttl will be halfway expired
      avow.strictEqual(expected, cachedFn())
    })

    it('should not return the cached result if outside the TTL', async () => {
      const { fn, now } = setup()

      const cachedFn = makeCached({ fn })
      const expected = cachedFn()

      timekeeper.freeze(now + (CACHE_TTL + 1000))
      avow.notStrictEqual(expected, cachedFn())
    })

    it('should keep caches separate when given cache object', async () => {
      const { fn, now } = setup()

      const cache1 = new memoryCache.Cache()
      const cache2 = new memoryCache.Cache()
      const cachedFn1 = makeCached({ cache: cache1, fn })
      const cachedFn2 = makeCached({ cache: cache2, fn })

      const result11 = cachedFn1()
      timekeeper.freeze(now + 10)
      const result21 = cachedFn2()
      timekeeper.freeze(now + 20)
      const result12 = cachedFn1()
      const result22 = cachedFn2()

      avow.strictEqual(result11, result12)
      avow.strictEqual(result21, result22)
      avow.notStrictEqual(result11, result21)
    })

    it('should keep separate same function when given different names', async () => {
      const { fn, now } = setup()

      const cachedFn1 = makeCached({ fn, name: 'name1' })
      const cachedFn2 = makeCached({ fn, name: 'name2' })

      const result11 = cachedFn1()
      timekeeper.freeze(now + 10)
      const result21 = cachedFn2()
      timekeeper.freeze(now + 20)
      const result12 = cachedFn1()
      const result22 = cachedFn2()

      avow.strictEqual(result11, result12)
      avow.strictEqual(result21, result22)
      avow.notStrictEqual(result11, result21)
    })

    it('should keep separate same function when given different arguments', async () => {
      const { fn, now } = setup()

      const cachedFn = makeCached({ fn })

      const result11 = cachedFn()
      timekeeper.freeze(now + 10)
      const result21 = cachedFn({ arg: 'value' })
      timekeeper.freeze(now + 20)
      const result12 = cachedFn()
      const result22 = cachedFn({ arg: 'value' })

      avow.strictEqual(result11, result12)
      avow.strictEqual(result21, result22)
      avow.notStrictEqual(result11, result21)
    })

    it('should work when given ttl', async () => {
      const { fn, now } = setup()
      const ttl = 1234
      const cachedFn = makeCached({ fn, ttl })
      const result1 = cachedFn()

      timekeeper.freeze(now + (ttl / 2))
      const result2 = cachedFn()
      avow.strictEqual(result1, result2)

      timekeeper.freeze(now + ttl + 100000)
      const result3 = cachedFn()
      avow.notStrictEqual(result1, result3)
    })

    it('should work when given context for fn', async () => {
      const { now } = setup()
      const fn = function() { return this.a }

      const context1 = { a: 'context1' }
      const context2 = { a: 'context2' }

      const cachedFn1 = makeCached({ fn, context: context1 })
      const cachedFn2 = makeCached({ fn, context: context2 })

      const result11 = cachedFn1()
      timekeeper.freeze(now + 10)
      const result21 = cachedFn2()
      timekeeper.freeze(now + 20)
      const result12 = cachedFn1()
      const result22 = cachedFn2()

      avow.strictEqual(result11, result12)
      avow.strictEqual(result21, result22)
      avow.notStrictEqual(result11, result21)
    })

    it('should throw if not given a fn', async () => {
      avow.throws(
        () => { makeCached() },
        'no fn given'
      )
    })
  })

  describe('makeCachedObjPath', () => {
    afterEach(() => {
      timekeeper.reset()
      GLOBAL_CACHE.clear()
    })

    const setup = () => {
      const now = new Date().getTime()
      const fn = () => new Date().getTime()

      const obj = {
        deep: {
          nested: {
            fn,
          },
          nested2: {
            fn,
          },
        },
      }

      const path = 'deep.nested.fn'
      const path2 = 'deep.nested2.fn'
      const pathBeforeDot = 'deep.nested'

      timekeeper.freeze(now)
      return { fn, now, obj, path, path2, pathBeforeDot }
    }

    it('should properly cache method when given object and path', async () => {
      const { fn, now, obj, path, pathBeforeDot } = setup()

      const cachedFn1 = makeCachedObjPath({ obj, path })

      // The above is equivalent to:
      const cachedFn2 = makeCached({ context: get(pathBeforeDot)(obj), fn, name: path })

      // So we would expect the caching to work, and for the results to match
      const result11 = cachedFn1()
      timekeeper.freeze(now + 10)
      const result12 = cachedFn1()
      const result21 = cachedFn2()
      timekeeper.freeze(now + CACHE_TTL + 20)
      const result13 = cachedFn1()

      avow.strictEqual(result11, result12)
      avow.strictEqual(result12, result21)
      avow.notStrictEqual(result11, result13)
    })

    it('should work with repeated calls on the same object because of currying', async () => {
      const { now, obj, path, path2 } = setup()

      const curried = makeCachedObjPath({ obj })

      const cachedFn1 = curried({ path })
      const cachedFn2 = curried({ path: path2 })

      const result11 = cachedFn1()
      timekeeper.freeze(now + 10)
      const result21 = cachedFn2()
      timekeeper.freeze(now + 20)
      const result12 = cachedFn1()
      const result22 = cachedFn2()

      avow.strictEqual(result11, result12)
      avow.strictEqual(result21, result22)
      avow.notStrictEqual(result11, result21)
    })
  })

  describe('getContextAndFnFromObjPath', () => {
    it('should return the appropriate context and fn when given object and path', async () => {
      const theFn = () => new Date().getTime()
      const obj = {
        deep: {
          nested: {
            fn: theFn,
          },
        },
      }

      const path = 'deep.nested.fn'

      const { context, fn } = getContextAndFnFromObjPath({ obj, path })

      avow.deepStrictEqual(context, obj.deep.nested)
      avow.deepStrictEqual(fn, obj.deep.nested.fn)
    })
  })
})
