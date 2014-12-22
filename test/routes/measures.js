measures = require('../measures')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send(measures);
});

module.exports = router;
