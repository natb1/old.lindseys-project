var controllers = angular.module('lindseysControllers', []);

controllers.controller('NavCtrl', ['$scope', 'alerts',
  function ($scope, alerts){
    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
  }
]);

controllers.controller('DomainCtrl', ['$scope', '$modal', 'Domains', 'Studies', 'alerts', '$rootScope',
  function ($scope, $modal, Domains, Studies, alerts, $rootScope) {

    $scope.studies = {}
    $scope.domains = Domains.get(
      function(){},
      function(error){
        message = 'failed to download domains'
        alerts.add_alert(message, 'danger')
        console.log(error)
      }
    )
  
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

      $rootScope.loading = true

      var modalInstance = $modal.open({
        templateUrl: 'partials/domains-edit.html',
        controller: 'DomainNewCtrl',
        resolve: {
            domains: function(){ return $scope.domains }
        }
      })

      modalInstance.result.then(function(new_domain){
        //not implemented
      }, function(reason){
        $scope.domains = Domains.get(function(){
          $rootScope.loading = false
        }, function(error){
          message = 'failed to download domains'
          alerts.add_alert(message, 'danger')
          console.log(error)
        })
      });
    }

  }
]);

controllers.controller('DomainNewCtrl', ['$scope', '$modalInstance', 'alerts', 'domains', 'Measures', 'Domains',
  function($scope, $modalInstance, alerts, domains, Measures, Domains){

    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
    $scope.domains = domains
    modified_domains = {}
    deleted_domains = {}
    $scope.measures = Measures.get(
      function(){},
      function(error){
        message = 'failed to download measures'
        alerts.add_alert(message, 'danger')
        console.log(error)
      }
    )

    $scope.new_domain = function(){
      modified_domains[$scope.new_domain_input] = true
      $scope.domains[$scope.new_domain_input] = []
      $scope.selected_domain = $scope.new_domain_input
      $scope.new_domain_input = undefined
    }

    $scope.delete_domain = function(){
      if ($scope.selected_domain in modified_domains){
        delete modified_domains[$scope.selected_domain]
      }else{
        deleted_domains[$scope.selected_domain] = true
      }
      delete $scope.domains[$scope.selected_domain]
      delete $scope.selected_domain
    }

    $scope.in_domain = function(domain, measure){
      if (!domain){
        return false
      }
      measures = domains[domain]
      for(var i=0; i<measures.length; i++){
        if (measures[i] == measure){
          return true
        }
      }
      return false
    }

    $scope.$watch('selected_measure', function(newValue, oldValue){
      if (newValue){
        modified_domains[$scope.selected_domain] = true
        $scope.domains[$scope.selected_domain].push(newValue)
        $scope.selected_measure = undefined
      }
    });

    $scope.delete_measure_from_domain = function(measure_name){
      measures = $scope.domains[$scope.selected_domain]
      for (var i=0; i<measures.length; i++){
        if (measures[i] == measure_name){
          measures.splice(i,1)
        }
      }
    }

    $scope.ok = function(){
      async.parallel([_modify_domains, _delete_domains],
      function(err, results){
        if (!err){
          $modalInstance.dismiss('ok')
        }
      });
    }

    _modify_domains = function(done_modify){
      async.each(Object.keys(modified_domains), function(domain, done_domain){
        Domains.put({domain_name:domain}, $scope.domains[domain], 
          function(){
            delete modified_domains[domain]
            done_domain()
          }, function(error){
            message = 'failed to upload modified domain "'+domain+'"'
            alerts.add_alert(message, 'danger')
            console.log(error)
            done_domain(message)
          }
        );
      }, done_modify);
    }

    _delete_domains = function(done_delete){
      async.each(Object.keys(deleted_domains), function(domain, done_domain){
        Domains.delete({domain_name:domain}, 
          function(){
            delete deleted_domains[domain]
            done_domain()
          }, function(error){
            message = 'failed to delete domain "'+domain+'"'
            alerts.add_alert(message, 'danger')
            console.log(error)
            done_domain(message)
          }
        );
      }, done_delete);
    }

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel')
    }
  }
])
