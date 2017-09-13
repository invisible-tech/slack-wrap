'use strict'

const memoryCache = require('memory-cache')
const {
  reduce,
  set,
} = require('lodash/fp')

const { makeCachedObjPath } = require('~/src/helpers/cachedFn')
const overrideProxy = require('~/src/helpers/overrideProxy')

/**
 * Creates the overridden, cached versions of functions, given an object and
 *   an array of paths to the methods to cache (with optional ttl)
 * @method makeOverrides
 * @private
 * @param {Object} options.cache - The cache object from memory-cache
 * @param {Array<Object>} options.cachedPaths - Array of the form
 *   [{ path, ttl }, { path, ttl }], for all paths to override
 * @param {Object} options.obj - The object containing the methods
 * @return {Object} - An object with the overriden methods that can be fed into
 *   overrideProxy
 */
const makeOverrides = ({ cache, cachedPaths = false, obj }) => {
  const cached = makeCachedObjPath({ cache, obj })
  const newMethods = cachedPaths ?
    reduce(
      (acc, { path, ttl }) =>
        set(path, cached({ path, ttl }))(acc),
      {}
    )(cachedPaths) :
    {}
  const getCache = () => cache
  return Object.assign({}, { getCache }, newMethods)
}

/**
 * Given an object that contains methods, and an array of paths to the methods
 *   you want to cache (with optional ttl), returns a Proxy of the object that
 *   uses the cached versions of the functions matching the cached paths
 * @method cachedProxy
 * @param {Array<Object>} options.cachedPaths - Array of the form
 *   [{ path, ttl }, { path, ttl }], for all paths to override
 * @param {Object} options.obj - The object containing the methods
 * @return {Proxy} - The proxy with the object and correct overrides
 */
const cachedProxy = ({ cachedPaths = false, obj } = {}) => {
  const cache = new memoryCache.Cache()
  const overrides = makeOverrides({ cache, cachedPaths, obj })
  return overrideProxy({ obj, overrides })
}

module.exports = cachedProxy
