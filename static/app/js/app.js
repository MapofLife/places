'use strict';


angular.module('mol.controllers',[]);

angular.module('mol', [
  //base angular
  'ngSanitize', 'ngAnimate',
  'angular.filter',

  //3rd party ui
  'ui.bootstrap', 'ui.router', 'ct.ui.router.extras',
  'uiGmapgoogle-maps', 'ngError',

  //'mol.meta',
  'mol.api', 'mol.ui-map', 'mol.filters', 'mol.services',
  'mol.species-description', 'mol.species-images',
  'mol.controllers', 'mol.loading-indicator',

  'percentage', 'km2',
])
.constant('molConfig',{
    "module" : "regions", //module name (used in routing)
    "api" : "0.x",
    "url" :  '/',
    "lang" : "en",
    "prod":(window.location.hostname!=='localhost') //boolean for MOL production mode
})
.config(['uiGmapGoogleMapApiProvider',
	function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyABlkTTWW1KD6TrmFF_X6pjWrFMGgmpp9g',
        v: '3.24', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization',
        language:'en'

    });
}])
.config(['molConfig','$sceDelegateProvider','$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function(molConfig,$sceDelegateProvider,$stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {


  var params = ""+
    "regiontype&region&regionid&dsid&type&bounds&" + //selected data options
    "embed&sidebar&header&subnav&footer&speciessearch&regionsearch";

  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http*://localhost**',
      'http*://127.0.0.1:9001/**',
      'http*://*mol.org/**',
      'http*://api.mol.org/**',
      'http*://mapoflife.github.io/**'
    ]);
  $httpProvider.defaults.useXDomain = true;
  //send cookies
  $httpProvider.defaults.withCredentials = false;
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state(
      'root',
      {
        abstract:true,
        templateUrl: "static/app/layouts/map-with-sidebars.html",
        controller: 'baseCtrl'
      }
    ).state(
      'root.regions',
      {
        url: '/?{0}'.format(params),
        deepStateRedirect: true,
        sticky: true,
        views: {
          "region@root": {
            templateUrl: "",
            controller: "molRegionCtrl",
            resolve : {
              regionType: function(molApi, $stateParams) {
                  /*return molApi({
                    "service" : "spatial/regions/types"
                  }).then(function(response) {
                    var defaultType = ($stateParams.regiontype || 'global');
                    return response.data.find(function(type) {
                      return type.type.toLowerCase() === defaultType
                    });
                  })*/
                  var defaultType = ($stateParams.regiontype || 'global');
                  return [
                    {"dataset_id": "3fc08de0-49e9-479d-95f4-42b2ad82f3bf", "citation": "IUCN and UNEP-WCMC (2016), The World Database on Protected Areas (WDPA), February 2016, Cambridge, UK: UNEP-WCMC. Available at: www.protectedplanet.net.", "type": "national_parks", "dataset_title": "National Parks", "title": "National Parks"}, {"dataset_id": "e9707baa-46e2-4ec4-99b6-86b1712e02de", "citation": "Global Administrative Areas. (2016). GADM database of Global Administrative Areas, version 2.8. http://www.gadm.org.", "type": "countries", "dataset_title": "Global Administrative Areas v 2.8", "title": "Political boundaries"}, {"dataset_id": "1603cb8b-918c-40ac-8732-ff0c20e1ed19", "citation": "TBA", "type": "mountains", "dataset_title": "Mountain Ranges", "title": "Mountain Ranges"}]
                      .find(function(type) {
                        return type.type.toLowerCase() === defaultType
                      });
              },
              region: function(regionType, molApi, $stateParams) {
                  if(regionType.dataset_id && $stateParams.region && !$stateParams.regionid) {
                    return molApi({
                      "service" : "spatial/regions/list",
                      "loading" :true,
                      "params" : {
                        "dataset_id": regionType.dataset_id}
                    }).then(
                      function(response){
                      return (response.data.find(function(region){
                        return region.name === $stateParams.region;
                      }) || regionType);

                    })
                  } else if ($stateParams.regionid && $stateParams.region) {
                    return {
                      region_id: $stateParams.regionid,
                      name: $stateParams.region,
                      bnds: $stateParams.bounds
                    }
                  } else {
                    return regionType
                  };
              },
              groups: function(region, $stateParams) {

              }
            }
          },
          "taxo-groups@root": {
            templateUrl: "static/app/views/species-list/list.html",
            controller: "molTaxoGroupsCtrl"
          }
        }
      }
    );
    $locationProvider.html5Mode(true);

}]);
