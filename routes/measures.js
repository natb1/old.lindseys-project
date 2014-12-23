var express = require('express');
var router = express.Router();

var measures = require('../test/measures')
router.get('/', function(req, res) {
  res.send(measures);
});

module.exports = router;
