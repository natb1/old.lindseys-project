exports.config = {
  capabilities: {
    'browserName': 'phantomjs'
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    //'e2e/*/*.js'
    'e2e/test.js'
  ]
};
