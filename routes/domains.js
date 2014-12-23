var s3_utils = require('s3_utils')
var express = require('express');
var router = express.Router();

var domain_bucket = 'lindseys_project_domains'

s3_utils.init_bucket_if_not_exists(domain_bucket)

router.get('/', function(req, res) {
  s3_utils.get_objs(domain_bucket, function(obj){return true},
    function(domains){
      res.send(domains);
    }, function(err){
      res.status(500).end()
    }
  )
});

router.put('/:name', function(req, res){
  s3_utils.put_obj(domain_bucket, req.param('name'), req.body,
    function(){
      res.status(204).end()
    }, function(err){
      res.status(500).end()
    }
  )
});

router.delete('/:name', function(req, res){
  s3_utils.delete_obj(domain_bucket, req.param('name'),
    function(){
      res.status(204).end()
    }, function(err){
      res.status(500).end()
    }
  )
});

module.exports = router;
