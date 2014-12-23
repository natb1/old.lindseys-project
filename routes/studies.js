var s3_utils = require('s3_utils')
var express = require('express');
var router = express.Router();

var study_bucket = 'lindseys_project_studies'

s3_utils.init_bucket_if_not_exists(study_bucket)

router.get('/', function(req, res) {
  var measure = req.query.measure
  if (measure){
    var filter = function(obj){
      for (var i=0; i<obj.measures.length; ++i){
        if (obj.measures[i] == measure){
          return true
        }
      }
      return false
    }
  }else{
    var filter = function(obj){ return true }
  }
  s3_utils.get_objs(study_bucket, filter, function(studies){
    res.send(studies);
  }, function(err){
    res.status(500).end()
  });
});

router.put('/:title', function(req, res){
  s3_utils.put_obj(study_bucket, req.param('title'), req.body, function(){
    res.status(204).end()
  }, function(err){
    res.status(500).end()
  })
});

router.delete('/:title', function(req, res){
  s3_utils.delete_obj(study_bucket, req.param('title'), function(){
    res.status(204).end()
  }, function(err){
    res.status(500).end()
  })
});

module.exports = router;
