'use strict'

const parseFunction = require('parse-function')
const {
  each,
  eq,
  findIndex,
} = require('lodash/fp')

const { exportForTest } = require('~/src/helpers/utility')

const fnParser = parseFunction()

const OPTS = 'opts'

/**
 * Given an Array of Strings representing position-based parameters for a function,
 *   and an object representing the arguments bound to these formal params, return
 *   an Array of the arguments, in the correct order.
 *
 *  Note: treats a parameter with the name `opts` as a special case.
 *    If `opts` appears in the params, the argument will be an object consisting
 *    of all args that are not bound to the other explicit params.
 *    Otherwise, we just discard args bound to unrecognized params.
 *
 * @method objArgsToArray
 * @private
 * @example
 *   > objArgsToArray({obj: { a: 1, b: 2, c: 3, d: 4, e: 5 }, params: ['b', 'c', 'a', 'opts' ]})
 *   [2, 3, 1, { d: 4, e: 5 }]
 *   >  objArgsToArray({obj: { a: 1, b: 2, c: 3, d: 4, e: 5 }, params: ['b', 'c', 'a' ]})
 *   [2, 3, 1]
 *
 * @param {Object} obj - a POJO with arguments bound to parameter names
 * @param {Array} params - an Array of Strings representing the parameter names
 * @return {Array} an Array of arguments in the correct order
 */
const objArgsToArray = ({ obj, params }) => {
  const args = []
  const optsIndex = findIndex(eq(OPTS))(params)
  const hasOpts = optsIndex !== -1
  each(param => {
    if (param === OPTS) {
      args.push(undefined)
      // We'll deal with these after the 'each' but we need a space for them
    } else if (obj) {
      args.push(obj[param])
      delete obj[param]
    }
  })(params)
  if (hasOpts) args[optsIndex] = obj
  return args
}

/**
 * Given a function that accepts positional arguments (or no arguments), returns
 *   a new function that will accept an Object as argument, with arguments bound
 *   to the params of the original function. Optionally accepts a parent object
 *   that the function should be bound to (if the function uses `this`)
 *
 * @method destructArgsFn
 * @example
 *   > const fn = (a, b, c) => a + b + c
 *   > destructArgsFn(fn)({ a: 1, b: 2, c: 3 })
 *   6
 *
 * @param {Function} options.fn - the Function to modify
 * @param {Object} options.parent - Optional: the context in which you want the new
 *   function to be executed in
 * @return {Function} - The new Function
 */
const destructArgsFn = ({ fn, parent = undefined }) => {
  // these should be called params, and the `params` field returned from
  // fnParser.parse is just a string of the params
  const { args: params } = fnParser.parse(fn)
  if (params.length === 1 && params[0] === false) {
    // This method already takes one argument that is an object, so just return it
    fn.bind(parent)
    return fn
  }
  return obj => fn.bind(parent)(...objArgsToArray({ obj, params }))
}

module.exports = {
  destructArgsFn,
}

exportForTest(module, {
  objArgsToArray,
})
