domains = require('../test/domains')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send(domains);
});

module.exports = router;
