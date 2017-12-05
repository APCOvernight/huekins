module.exports = function (config) {
  config.set({
    files: [
      {
        pattern: 'index.js',
        mutated: true,
        included: false
      },
      'test/**/*.spec.js'
    ],
    testRunner: 'mocha',
    mutator: 'javascript',
    transpilers: [],
    reporter: ['html', 'clear-text', 'progress'],
    testFramework: 'mocha',
    coverageAnalysis: 'off'
  })
}
