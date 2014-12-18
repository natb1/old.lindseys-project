studies = require('../test/studies')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  measure = req.query.measure
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
});

module.exports = router;