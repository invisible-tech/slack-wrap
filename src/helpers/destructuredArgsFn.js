'use strict'

const parseFunction = require('parse-function')

const objArgsToArray = require('./objArgsToArray')

const fnParser = parseFunction()

/**
 * Given a function that accepts positional arguments (or no arguments), returns
 *   a new function that will accept an Object as argument, with arguments bound
 *   to the params of the original function. Optionally accepts a context object
 *   that the function should be bound to (if the function uses `this`)
 *
 * @method destructuredArgsFn
 * @example
 *   > const fn = (a, b, c) => a + b + c
 *   > destructuredArgsFn(fn)({ a: 1, b: 2, c: 3 })
 *   6
 *
 * @param {Function} options.fn - the Function to modify
 * @param {Object} options.context - Optional: the context in which you want the new
 *   function to be executed in
 * @return {Function} - The new Function
 */
const destructuredArgsFn = ({ fn, context = undefined }) => {
  // these should be called params, and the `params` field returned from
  // fnParser.parse is just a string of the params
  const { args: params } = fnParser.parse(fn)

  const expectsNamedArgs = params.length === 1 && params[0] === false
  if (expectsNamedArgs) {
    return context ? fn.bind(context) : fn
  }
  return obj => fn.apply(context, objArgsToArray({ obj, params }))
}

module.exports = destructuredArgsFn
