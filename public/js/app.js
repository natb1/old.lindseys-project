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
