'use strict'

const {
  isObjectLike,
} = require('lodash/fp')

const { destructArgsFn } = require('~/src/helpers/destructArgsFn')

/**
 * Recursively proxies an object and all its methods to accept destructured
 *   arguments
 * @method destructArgsProxu
 * @private
 * @param {Object} unwrapped - The object to proxy recursively
 * @return {Proxy} - The Proxy of the object
 */
const destructArgsProxy = unwrapped => {
  const handler = {
    get(target, name) {
      // lodash isObject returns true for functions, so we use isObjectLike
      if (isObjectLike(unwrapped[name])) {
        // recurse on the sub object
        // this allows us to override deep keys while keeping the other references
        return destructArgsProxy(unwrapped[name])
      }
      return destructArgsFn({ fn: unwrapped[name], parent: unwrapped })
    },
  }
  return new Proxy(unwrapped, handler)
}

/**
 * Wraps the Slack Web Client and returns the wrapped version
 * @method wrap
 * @param {Object} unwrapped - The object to wrap
 * @return {Object} [the wrapped object]
 */
const wrap = unwrapped => {
  const getUnwrapped = () => unwrapped
  const wrapped = true
  const allOverrides = { getUnwrapped, wrapped }
  return Object.assign(destructArgsProxy(unwrapped), allOverrides)
}

module.exports = {
  wrap,
}
