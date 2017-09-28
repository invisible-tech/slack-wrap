'use strict'

const assert = require('assert')
const memoryCache = require('memory-cache')
const ncurry = require('ncurry')
const {
  flow,
  get,
  includes,
  isUndefined,
  join,
  slice,
  split,
} = require('lodash/fp')

const { exportForTest } = require('src/helpers/utility')

const CACHE_TTL = 1000 * 60 * 1 // one minute in milliseconds
const GLOBAL_CACHE = new memoryCache.Cache()

const beforeLastDot = flow(split('.'), slice(0, -1), join('.'))
const containsDot = includes('.')

/**
 * Generates a cache key string based on the name of the method and options passed in
 * @method cacheKey
 * @param {String} options.name - Name of the method we're caching
 * @param {Object} options.options - Optional: object of options
 * @return {String} - The cache key
 */
const cacheKey = ({ name, options }) => {
  if (isUndefined(name)) return undefined
  return isUndefined(options) ?
    `${name}` :
    `${name}-${JSON.stringify(options)}`
}

/**
 * Takes a function and returns a cached version of it
 * @method makeCached
 * @param {Object} options.cache - Optional: The cache object from memory-cache
 * @param {Object} options.context - Optional: the context to bind the function to
 * @param {Function} options.fn - The function to transform
 * @param {String} options.name - Optional: name of the method we're caching
 * @param {Number} options.ttl - Optional: The TTL for this function in the cache
 * @return {Function} - the cached function
 */
const makeCached = ({ cache = GLOBAL_CACHE, context, fn, name, ttl = CACHE_TTL } = {}) => {
  assert(fn, 'no fn given')
  const cacheKeyName = name || fn.toString()
  const boundFn = fn.bind(context)

  return (...options) => {
    // include context in the cacheKey too as this could affect how the function is run
    const key = cacheKey({ name: cacheKeyName, options: { context, options } })
    const value = cache.get(key)
    if (value) return value

    const newValue = boundFn(...options)

    // Cache the value
    cache.put(key, newValue, ttl)
    return newValue
  }
}

/**
 * Given an object and a string path to a function in that object, returns the
 *   context for that function and the actual function
 * @method getContextAndFnFromObjPath
 * @private
 * @param {Object} options.obj - The Object containing the function
 * @param {String} options.path - The path to the function in the object
 * @return {Object} - Of the form { context, fn }
 */
const getContextAndFnFromObjPath = ({ obj, path }) => {
  const context = containsDot(path) ?
    get(beforeLastDot(path))(obj) :
    obj

  const fn = get(path)(obj)
  return { context, fn }
}

/**
 * Creates a cached version of a function, given the object containing the method,
 *   and the path to the method.
 *   Note: this method is curried via ncurry
 * @method makeCachedObjPath
 * @param {Object} options.cache - Optional: The cache object from memory-cache
 * @param {Object} options.obj - The object containing the method to make cached
 * @param {String} options.path - The path to the method we want to make cached
 * @param {Number} options.ttl - Optional: The TTL for this function in the cache
 * @return {Function} - The cached version of the function
 */
const makeCachedObjPath = ncurry(
  ['obj', 'path'],
  ({ cache = GLOBAL_CACHE, obj, path, ttl = CACHE_TTL }) => {
    const { context, fn } = getContextAndFnFromObjPath({ obj, path })
    return makeCached({ cache, context, fn, name: path, ttl })
  }
)

module.exports = {
  CACHE_TTL,
  GLOBAL_CACHE,
  makeCached,
  makeCachedObjPath,
}

exportForTest(module, {
  cacheKey,
  getContextAndFnFromObjPath,
})
