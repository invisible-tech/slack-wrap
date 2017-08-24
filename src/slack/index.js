'use strict'

const {
  isObject,
  isFunction,
} = require('lodash/fp')

const destructuredArgsFn = require('../helpers/destructuredArgsFn')

/**
 * Recursively proxies an object and all its methods to accept destructured
 *   arguments
 * @method destructuredArgsProxy
 * @private
 * @param {Object} unwrapped - The object to proxy recursively
 * @return {Proxy} - The Proxy of the object
 */
const destructuredArgsProxy = unwrapped => {
  const handler = {
    get(target, name) {
      const deepAccess = isObject(unwrapped[name]) && (! isFunction(unwrapped[name]))
      if (deepAccess) {
        // this allows us to override deep keys while keeping the other references
        return destructuredArgsProxy(unwrapped[name])
      }
      return destructuredArgsFn({ fn: unwrapped[name], parent: unwrapped })
    },
  }
  return new Proxy(unwrapped, handler)
}

module.exports = {
  wrap: destructuredArgsProxy,
}
