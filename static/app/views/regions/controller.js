angular.module('mol.controllers')
  .controller('molRegionCtrl',
  	['$http','$scope', '$state','$rootScope', '$uibModal',  '$filter','$timeout',
     '$location','$q','molRegionOverlay','molConfig','region',
   		function( $http, $scope, $state, $rootScope, $modal, $filter, $timeout,
         $location, $q, molRegionOverlay,molConfig,region) {

      $scope.model.region = region;

      $scope.$watch("model.region", function(n,o) {
          if(n && !angular.equals(n,o)) {
            $scope.setRegion(n);
          }
      },true);

      $scope.setRegion = function(r) {
            if(r) {
              molRegionOverlay(r).then(
                function(overlay){
                  if(overlay){
                    $scope.model.map.setOverlay(angular.extend(overlay,{index:0}),0);
                  } else {
                    $scope.model.map.setOverlay({index:0},0);
                  }
                  if(r.bnds) {
                    $scope.model.map.bounds = {
                      southwest: {latitude: r.bnds[1],longitude: r.bnds[0]},
                      northeast: {latitude: r.bnds[3],longitude: r.bnds[2]}
                    };
                  } else {
                    $scope.model.map.zoom = 2;
                  }
                });


                  //Get metdata for features on the map
                  $scope.model.map.getInfoWindowModel = function(map, eventName, latLng, data) {

                    if(data) {
                    switch(eventName) {
                      case 'click':
                        var bnds = data.bnds = data.bnds.split(',')
                          .map(function(n){return parseFloat(n);});
                        if(bnds) {
                            $scope.model.map.bounds = {
                              southwest: {latitude: bnds[1],longitude: bnds[0]},
                              northeast: {latitude: bnds[3],longitude: bnds[2]}
                            };
                        }
                          $state.transitionTo(
                            $state.current.name,
                            {"region":data.name, "regionid": data.region_id, "bounds": data.bnds},
                            {"inherit":true});
                        //$scope.region = data;
                        //$scope.infowindowPromise.resolve({show:false});
                        //$scope.infowindowPromise = $q.defer();
                        break;
                      case 'mousemove':
                          /*$timeout(200).then(function() {
                              $scope.infowindowPromise.resolve( {
                              model: data,
                              show: true,
                              templateUrl: 'static/app/views/region-map/infowindow.html'
                            });
                            $scope.infowindowPromise = $q.defer();
                          });*/
                      break;
                      default:
                        $scope.infowindowPromise.resolve({show:false});
                        $scope.infowindowPromise = $q.defer()
                      }
                  } else {
                    $scope.infowindowPromise.resolve({show: false});
                    $scope.infowindowPromise = $q.defer() ;
                  }
                  return $scope.infowindowPromise.promise;
                }
              }
        }
        $scope.setRegion($scope.model.region);




  }])
