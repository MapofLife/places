angular.module('mol.controllers')
  .controller('baseCtrl',
  	['$http','$scope', '$state','$rootScope', '$uibModal',  '$filter','$timeout',
     '$location','$anchorScroll','$q','molUiMap','$window', 'molRegionOverlay','molConfig',
   		function( $http, $scope, $state, $rootScope, $modal, $filter, $timeout,
         $location, $anchorScroll, $q,molUiMap,$window, molRegionOverlay,molConfig) {

      angular.extend($scope, {
        toggles: {
          sidebars: {
            right: true,
            left: true
          }
        },

        model: {
          rc: false,
          lc: true,
          map: new molUiMap()
         //rc: ($state.params.scientificname && ),
         //lc: ($state.params.region && !$state.params.scientificname)
      }});

      $scope.$watch('rc', function(n,v){
        if(n!=v){
          $scope.$parent.map.resize();}});
      $scope.$watch('lc', function(n,v){
        if(n!=v){
          $scope.$parent.map.resize()};});



      $rootScope = $scope; //important for map
      $rootScope.molConfig = molConfig;
      //for view specific css targeting
      $rootScope.$state = $state;

      $scope.cleanURLName = function (name) {
        if(name) {return name.replace(/ /g, '_');}
      }


      $scope.getBounds = function(bnds) {
        var nbnds = {southwest: {
                latitude: bnds.southWest.lat,
                longitude: bnds.southWest.lng
                },
                northeast: {
                    latitude: bnds.northEast.lat,
                    longitude: bnds.northEast.lng
                }
            };
        return nbnds;
      }

      $scope.fitBounds = function(bnds) {
        try {
           var newbnds = angular.copy($scope.getBounds(bnds));
           //pin to region bounds if possible

           if(Object.keys($scope.region).length&&$scope.region.type!=='global') {
             newbnds.southwest.longitude = Math.max($scope.region.bnds[0]);
             newbnds.southwest.latitude = Math.max($scope.region.bnds[1]);
             newbnds.northeast.longitude = Math.min($scope.region.bnds[2]);
             newbnds.northeast.latitude = Math.min($scope.region.bnds[3]);
           }
           $scope.model.map.bounds = newbnds;
        } catch(e) {}

      }

      $scope.unionBounds = function(b1,b2) {
        var b = b1;
        try {
          b.southWest.lat = Math.min(b1.southWest.lat,b2.southWest.lat);
          b.southWest.lng = Math.min(b1.southWest.lng,b2.southWest.lng);
          b.northEast.lat = Math.max(b1.northEast.lat,b2.northEast.lat);
          b.northEast.lng = Math.max(b1.northEast.lng,b2.northEast.lng);
          return b;
        } catch (e) {return b1;}
      }


      $scope.infowindowPromise = $q.defer();



  }])
