var app = angular.module('lindseysApp', [
  'ui.bootstrap',
  'ui.grid',
  'ngRoute',
  'lindseysControllers',
  'lindseysServices'
]);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/domains', {
        templateUrl: 'partials/domains.html',
        controller: 'DomainsCtrl'
      }).
      when('/measures', {
        templateUrl: 'partials/measures.html',
        controller: 'MeasuresCtrl'
      }).
      when('/studies', {
        templateUrl: 'partials/studies.html',
        controller: 'StudiesCtrl'
      }).
      otherwise({
        //redirectTo: '/studies'
        templateUrl: 'partials/landing.html',
        controller: 'LandingCtrl'
      })
  }
]);
