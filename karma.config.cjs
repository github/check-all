module.exports = function (config) {
  const browsers = process.env.CI ? ['ChromeHeadlessNoSandbox'] : ['ChromeHeadless']

  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      {pattern: 'dist/index.js', type: 'module'},
      {pattern: 'test/test.js', type: 'module'}
    ],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    browsers,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
}
