const webpackConfig = require('./webpack.config')

process.env.BABEL_ENV = 'test' // so we load the correct babel plugins
const specHelper = 'test/test-setup.js'
const testGlob = 'test/**/*.spec.js'

module.exports = function setKarmaConfig(config) {
  config.set({
    autoWatch: false,
    basePath: 'client',
    browsers: ['Chrome'],
    colors: true,
    concurrency: Infinity,
    files: [specHelper, testGlob].map(dontWatch),
    frameworks: ['mocha', 'sinon-chai'],
    logLevel: config.LOG_INFO,
    port: 9876,
    preprocessors: {
      [specHelper]: ['webpack'],
      [testGlob]: ['webpack']
    },
    reporters: ['mocha'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true }
  })
}

function dontWatch(pattern) {
  return {
    pattern,
    included: true,
    served: true,
    watched: false
  }
}