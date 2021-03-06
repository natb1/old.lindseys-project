studies = require('../studies')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  measure = req.query.measure
  if (measure){
    studies_with_measure = {}
    for (study_name in studies){
      study = studies[study_name]
      for (var i=0; i<study.measures.length; ++i){
        if (study.measures[i] == measure){
          studies_with_measure[study_name] = study
        }
      }
    }
    res.send(studies_with_measure);
  }else{
    res.send(studies);
  }
});

router.put('/:title', function(req, res){
  console.log(req.param('title'), req.body)
  studies[req.param('title')] = req.body
  res.status(204).end()
});

router.delete('/:title', function(req, res){
  delete studies[req.param('title')]
  res.status(204).end()
});

module.exports = router;
