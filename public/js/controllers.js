var controllers = angular.module('lindseysControllers', []);

controllers.controller('NavCtrl', ['$scope', 'alerts',
  function ($scope, alerts){
    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
  }
]);

controllers.controller('DomainCtrl', ['$scope', '$modal', 'Domains', 'Studies', 'alerts',
  function ($scope, $modal, Domains, Studies, alerts) {

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

    $scope.new_domain = function(){

      $scope.loading = true

      var modalInstance = $modal.open({
        templateUrl: 'partials/domain-new.html',
        controller: 'DomainNewCtrl',
        resolve: {
            domains: function(){ return $scope.domains }
        }
      })

      modalInstance.result.then(function(new_domain){
        $scope.domains = Domains.get(function(){
          $scope.loading = false
          if(new_domain){
            $scope.select_domain(new_domain)
          }
        })
      });
    }

  }
]);

controllers.controller('DomainNewCtrl', ['$scope', '$modalInstance', 'alerts', 'domains',
  function($scope, $modalInstance, alerts, domains){

    $scope.domains = domains

    $scope.new_domain = function(name){
      console.log('new domain '+name)
    }

    $scope.ok = function(){
      $modalInstance.close();
    }

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel')
    }
  }
])
