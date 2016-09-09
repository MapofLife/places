angular.module('mol.controllers')
  .controller('molTaxoGroupsCtrl',
  	['$scope','$window', 'molApi',
   		function( $scope, $window,molApi) {


      $scope.pageSize = Math.floor(($window.innerHeight-300)/60)
      $scope.getTaxoGroups = function(n) {
        if(n.region_id) {
          molApi({
             "canceller": $scope.canceller,
             "loading": true,
             "service" : "spatial/regions/species2",
             "params" : {
               "region_id":n.region_id,
               "lang":"en"
             },
             "creds" : true,
          }).then(function(response){
            $scope.model.taxogroups = response.data;
          });
        } else {
          $scope.model.taxogroups = undefined}
      }
      $scope.$watch(
        'model.region',
        function(n,o) {
          if(!angular.equals(n,o)) {$scope.getTaxoGroups(n)}
        }, true
      );

      $scope.getTaxoGroups($scope.model.region);


  }]);
