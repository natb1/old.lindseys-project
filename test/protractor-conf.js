exports.config = {
  baseUrl: 'http://localhost:3000',
  //capabilities: {
  //  'browserName': 'phantomjs'
  //},
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'e2e/*/*.js'
  ]
};
