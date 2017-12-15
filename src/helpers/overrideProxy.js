'use strict'

const {
  get,
  isFunction,
  isObject,
} = require('lodash/fp')

/**
 * Uses proxies to recursively return the overridden values or the value
 * from the unwrapped object by default. This is better than other methods in
 * that it keeps the overrides separate from the originals and
 * seamlessly gives access to the original methods when no override exists.
 *
 * Note: this will panic if the field name given refers to an object in both
 *   unwrapped and overrides
 *
 * @method overrideProxy
 * @param {Object} options.obj - The object to wrap
 * @param {Object} options.overrides - The object with the overriding values
 * @return {Object} [the proxied object]
 */
function overrideProxy({ obj, overrides, path = undefined }) {
  const handler = {
    get: (target, name) => {
      if (typeof name !== 'string') {
        // see https://github.com/nodejs/node/issues/10731
        // This doesn't work perfectly yet, but good enough for now
        return get(path)(overrides)
      }
      const newPath = path ? `${path}.${name}` : name
      const override = get(newPath)(overrides)
      if (override) {
        const shouldRecurse = isObject(override) && ! isFunction(override)
        if (shouldRecurse) {
          // override deep keys while keeping the other references
          return overrideProxy({ obj, overrides, path: newPath })
        }
        return override
      }
      const objPath = get(newPath)(obj)
      if (isFunction(objPath)) {
        return (params = {}) => {
          const result = objPath(params)
          // If the result is a Promise add a catch handler.
          if (isObject(result) && get('then')(result)) {
            return result
              .catch(err => { throw Error(`ERROR: ${err.message} Name: ${name} Params: ${JSON.stringify(params)}`) })
          }
          return result
        }
      }
      return objPath
    },
  }

  return new Proxy(obj, handler)
}

module.exports = overrideProxy
