'use strict'

const {
  omit,
  reduce,
} = require('lodash/fp')

const OPTS_PARAM = 'opts'

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
const objArgsToArray = ({ obj, params }) =>
  reduce((acc, param) => (
    param === OPTS_PARAM
      ? [...acc, omit(params)(obj)]
      : [...acc, obj[param]]
  ))([])(params)

module.exports = objArgsToArray
