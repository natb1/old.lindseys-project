var services = angular.module('lindseysServices', ['ngResource']);

services.factory('Domains', ['$resource',
  function($resource){
    return $resource('domains/:domain_name', null,
      {
        'put': {method:'PUT'}
      });
  }
]);

services.factory('Measures', ['$resource',
  function($resource){
    return $resource('measures/:name', null,
      {
        'put': {method:'PUT'}
      })
  }
]);

services.factory('Studies', ['$resource',
  function($resource){
    return $resource('studies/:title', null,
      {
        'put': {method:'PUT'}
      })
  }
]);

services.factory('alerts', [
  function(){
    _alerts = []
    alerts = {
      add_alert: function(message, type_){
        _alerts.push({msg: message, type: type_})},
      close_alert: function(index){
        _alerts.splice(index, 1)},
      get_alerts: function(){
        return _alerts
      }
    }
    return alerts
  }
]);
      
