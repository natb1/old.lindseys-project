var s3_utils = require('s3_utils')
var express = require('express');
var router = express.Router();

var measure_bucket = 'lindseys_project_measures'

s3_utils.init_bucket_if_not_exists(measure_bucket)

router.get('/', function(req, res) {
  s3_utils.get_objs(measure_bucket, function(obj){return true},
    function(measures){
      res.send(measures);
    }, function(err){
      res.status(500).end()
    }
  )
});

router.put('/:name', function(req, res){
  s3_utils.put_obj(measure_bucket, req.param('name'), req.body,
    function(){
      res.status(204).end()
    }, function(err){
      res.status(500).end()
    }
  )
});

router.delete('/:name', function(req, res){
  s3_utils.delete_obj(measure_bucket, req.param('name'),
    function(){
      res.status(204).end()
    }, function(err){
      res.status(500).end()
    }
  )
});

module.exports = router;
