var controllers = angular.module('lindseysControllers', []);

controllers.controller('DomainExplorerCtrl', ['$scope', 'Domains',
  function ($scope, Domains) {

    $scope.domains = Domains.get()
  
    $scope.select_domain = function(domain_name){
      $scope.selected_domain = domain_name
    }

  }
]);
