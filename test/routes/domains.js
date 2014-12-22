domains = require('../domains')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send(domains);
});

router.put('/:domain_name', function(req, res){
  domains[req.param('domain_name')] = req.body
  res.status(204).end()
});

router.delete('/:domain_name', function(req, res){
  delete domains[req.param('domain_name')]
  res.status(204).end()
});

module.exports = router;
