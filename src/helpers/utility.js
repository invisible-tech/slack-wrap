'use strict'

const TEST_ENV = 'test'

const isTestEnv = () => process.env.NODE_ENV === TEST_ENV

const exportForTest = (module, obj) => {
  if (isTestEnv()) Object.assign(module.exports, obj)
}

module.exports = {
  isTestEnv,
  exportForTest,
}
