var controllers = angular.module('lindseysControllers', []);

controllers.controller('NavCtrl', ['$scope', 'alerts', '$location',
  function ($scope, alerts, $location){
    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
    $scope.is_active = function(page){
      return $location.path() == '/'+page
    }
  }
]);

controllers.controller('DomainsCtrl', ['$scope', '$modal', 'Domains', 'Studies', 'alerts', '$rootScope',
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

    $scope.edit_domains = function(){
      $rootScope.loading = true
      var modalInstance = $modal.open(_domains_edit_modal)
      modalInstance.result.then(
        function(new_domain){ throw 'not implemented' },
        _handle_domain_edit_dismiss
      );
    }

    _domains_edit_modal = {
      templateUrl: 'partials/domains-edit.html',
      controller: 'DomainNewCtrl',
      resolve: {
          domains: function(){ return $scope.domains }
      }
    }

    _handle_domain_edit_dismiss = function(reason){
      $scope.domains = Domains.get(function(){
        $rootScope.loading = false
      }, function(error){
        message = 'failed to download domains'
        alerts.add_alert(message, 'danger')
        console.log(error)
      })
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

controllers.controller('LandingCtrl', ['$scope',
  function($scope){
  }
]);

controllers.controller('StudiesCtrl', ['$scope', 'Studies', 'alerts', '$modal', '$rootScope',
  function($scope, Studies, alerts, $modal, $rootScope){

    $scope.studies = Studies.get(
      function(){
        //do nothing
      }, function(error){
        message = 'failed to download studies'
        alerts.add_alert(message, 'danger')
        console.log(error)
      }
    )

    $scope.new_study = function(){
      $rootScope.loading = true
      var modalInstance = $modal.open({
        templateUrl: 'partials/study-edit.html',
        controller: 'StudyEditCtrl',
        resolve: {
          title: function(){ return undefined },
          study: function(){ return {measures: []} }
        }
      }).result.then(
        function(new_domain){ throw 'not implemented' },
        _handle_study_edit_dismiss
      );
    }

    $scope.edit = function(title){
      $rootScope.loading = true
      var modalInstance = $modal.open({
        templateUrl: 'partials/study-edit.html',
        controller: 'StudyEditCtrl',
        resolve: {
          title: function(){ return title },
          study: function(){ return $scope.studies[title] }
        }
      }).result.then(
        function(new_domain){ throw 'not implemented' },
        _handle_study_edit_dismiss
      );
    }

    $scope.del = function(title){
      $rootScope.loading = true
      $modal.open({
        templateUrl: 'partials/study-del.html',
        controller: 'StudyDelCtrl',
        resolve: {
          title: function(){ return title },
          study: function(){ return $scope.studies[title] }
        }
      }).result.then(
        function(){ throw 'not implemented' },
        _handle_study_edit_dismiss
      );
    }

    _handle_study_edit_dismiss = function(reason){
      $scope.studies = Studies.get(function(){
        $rootScope.loading = false
      }, function(error){
        message = 'failed to download studies'
        alerts.add_alert(message, 'danger')
        console.log(error)
      })
    }

  }
]);

controllers.controller('StudyEditCtrl', ['$scope', '$modalInstance', 'Measures', 'Studies', 'alerts', 'title', 'study',
  function($scope, $modalInstance, Measures, Studies, alerts, title, study){

    $scope.is_new = (title === undefined)
    $scope.title = title
    $scope.study = study
    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
    $scope.has_measures = {}
    $scope.study.measures.forEach(function(measure){
      $scope.has_measures[measure] = true
    })
    $scope.measures = Measures.get(
      function(){},
      function(error){
        message = 'failed to download measures'
        alerts.add_alert(message, 'danger')
        console.log(error)
      }
    )

    $scope.delete_measure_from_study = function(measure_name){
      delete $scope.has_measures[measure_name]
    }

    $scope.in_study = function(measure_name){
      return measure_name in $scope.has_measures
    }

    $scope.$watch('selected_measure', function(newValue, oldValue){
      if (newValue){
        $scope.has_measures[$scope.selected_measure] = true
        $scope.selected_measure = undefined
      }
    });

    $scope.ok = function(){
      $scope.study.measures = Object.keys($scope.has_measures)
      Studies.put({title:$scope.title}, study,
        function(){
          $modalInstance.dismiss('ok')
        }, function(error){
          message = 'failed to put new study'
          alerts.add_alert(message, 'danger')
          console.log(error)
        }
      )
    }

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel')
    }
  }
])

controllers.controller('StudyDelCtrl', ['$scope', 'title', 'study', 'Studies', '$modalInstance', 'alerts',
  function($scope, title, study, Studies, $modalInstance, alerts){

    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
    $scope.study = study
    $scope.title = title

    $scope.ok = function(){
      Studies.delete({title:$scope.title},
        function(){
          $modalInstance.dismiss('ok')
        }, function(error){
          message = 'failed to delete study'
          alerts.add_alert(message, 'danger')
          console.log(error)
        }
      )
    }
     
    $scope.cancel = function(){
      $modalInstance.dismiss('cancel')
    }
  }
]);

controllers.controller('MeasuresCtrl', ['$scope', 'Measures', 'alerts', '$modal', '$rootScope',
  function($scope, Measures, alerts, $modal, $rootScope){

    $scope.measures = Measures.get(
      function(){
        //do nothing
      }, function(error){
        message = 'failed to download measures'
        alerts.add_alert(message, 'danger')
        console.log(error)
      }
    )

    $scope.new_measure = function(){
      $rootScope.loading = true
      var modalInstance = $modal.open({
        templateUrl: 'partials/measure-edit.html',
        controller: 'MeasureEditCtrl',
        resolve: {
          name: function(){ return undefined },
          measure: function(){ return {} }
        }
      }).result.then(
        function(){ throw 'not implemented' },
        _handle_measure_edit_dismiss
      );
    }

    $scope.edit = function(name){
      $rootScope.loading = true
      var modalInstance = $modal.open({
        templateUrl: 'partials/measure-edit.html',
        controller: 'MeasureEditCtrl',
        resolve: {
          name: function(){ return name },
          measure: function(){ return $scope.measures[name] }
        }
      }).result.then(
        function(new_domain){ throw 'not implemented' },
        _handle_measure_edit_dismiss
      );
    }

    $scope.del = function(name){
      $rootScope.loading = true
      $modal.open({
        templateUrl: 'partials/measure-del.html',
        controller: 'MeasureDelCtrl',
        resolve: {
          name: function(){ return name },
          measure: function(){ return $scope.measures[name] }
        }
      }).result.then(
        function(){ throw 'not implemented' },
        _handle_measure_edit_dismiss
      );
    }

    _handle_measure_edit_dismiss = function(reason){
      $scope.measures = Measures.get(function(){
        $rootScope.loading = false
      }, function(error){
        message = 'failed to download measures'
        alerts.add_alert(message, 'danger')
        console.log(error)
      })
    }

  }
]);

controllers.controller('MeasureEditCtrl', ['$scope', '$modalInstance', 'alerts', 'name', 'measure', 'Measures',
  function($scope, $modalInstance, alerts, name, measure, Measures){

    $scope.is_new = (name === undefined)
    $scope.name = name
    $scope.measure = measure
    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert

    $scope.ok = function(){
      Measures.put({name:$scope.name}, $scope.measure,
        function(){
          $modalInstance.dismiss('ok')
        }, function(error){
          message = 'failed to put new measure'
          alerts.add_alert(message, 'danger')
          console.log(error)
        }
      )
    }

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel')
    }
  }
])

controllers.controller('MeasureDelCtrl', ['$scope', 'name', 'measure', 'Measures', '$modalInstance', 'alerts',
  function($scope, name, measure, Measures, $modalInstance, alerts){

    $scope.get_alerts = alerts.get_alerts
    $scope.close_alert = alerts.close_alert
    $scope.measure = measure
    $scope.name = name

    $scope.ok = function(){
      Measures.delete({name:$scope.name},
        function(){
          $modalInstance.dismiss('ok')
        }, function(error){
          message = 'failed to delete measure'
          alerts.add_alert(message, 'danger')
          console.log(error)
        }
      )
    }
     
    $scope.cancel = function(){
      $modalInstance.dismiss('cancel')
    }
  }
]);
