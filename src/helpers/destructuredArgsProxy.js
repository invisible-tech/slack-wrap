'use strict'

const {
  isObject,
  isFunction,
} = require('lodash/fp')

const destructuredArgsFn = require('src/helpers/destructuredArgsFn')

/**
 * Recursively proxies an object and all its methods to accept destructured
 *   arguments
 * @method destructuredArgsProxy
 * @private
 * @param {Object} obj - The object to proxy recursively
 * @return {Proxy} - The Proxy of the object
 */
const destructuredArgsProxy = obj => {
  const handler = {
    set: (target, key, value) => {
      target[key] = value
      return true
    },

    get: (target, name) => {
      console.log(name)
      const shouldRecurse = Boolean(isObject(obj[name]) && ! isFunction(obj[name]))
      console.log(shouldRecurse)
      if (shouldRecurse) {
        // this allows us to override deep keys while keeping the other references
        return destructuredArgsProxy(obj[name])
      }
      if (isFunction(obj[name])) {
        return destructuredArgsFn({ fn: obj[name], context: obj })
      }
      return obj[name]
    },
  }
  const proxy = new Proxy(obj, handler)
  return proxy
}

module.exports = destructuredArgsProxy
