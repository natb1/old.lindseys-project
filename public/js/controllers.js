var controllers = angular.module('lindseysControllers', []);

controllers.controller('NavCtrl', ['$scope', 'alerts',
  function ($scope, alerts){
    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
  }
]);

controllers.controller('DomainCtrl', ['$scope', 'Domains', 'Studies', 'alerts',
  function ($scope, Domains, Studies) {

    $scope.domains = Domains.get()
    $scope.studies = {}
  
    $scope.select_domain = function(domain_name){
      $scope.selected_domain = domain_name
      measures = $scope.domains[domain_name]
      for(i=0;i<measures.length;i++){
        measure = measures[i]
        _get_studies_for_measure(measure)
      }
    }

    _get_studies_for_measure = function(measure){
      Studies.get({'measure':measure},
        function(measure_studies){
          $scope.studies[measure] = measure_studies
        },
        function(error){
          message = 'failed to download studies for measure "'+measure+'"'
          alerts.add_alert(message, 'danger')
          console.log(error)
        }
      )
    }

    $scope.new_domain = function(){}

  }
]);
