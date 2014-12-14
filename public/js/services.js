var services = angular.module('lindseysServices', ['ngResource']);

services.factory('Domains', ['$resource',
  function($resource){
    return $resource('domains')
  }
]);
