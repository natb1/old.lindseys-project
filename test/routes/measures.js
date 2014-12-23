measures = require('../measures')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send(measures);
});

router.put('/:name', function(req, res){
  console.log(req.param('name'), req.body)
  measures[req.param('name')] = req.body
  res.status(204).end()
});

router.delete('/:name', function(req, res){
  delete measures[req.param('name')]
  res.status(204).end()
});

module.exports = router;
