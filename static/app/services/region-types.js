angular.module('mol.services')
.factory('molRegionTypes', [
  function() {
    return [{"dataset_id": "3fc08de0-49e9-479d-95f4-42b2ad82f3bf", "citation": "IUCN and UNEP-WCMC (2016), The World Database on Protected Areas (WDPA), February 2016, Cambridge, UK: UNEP-WCMC. Available at: www.protectedplanet.net.", "type": "national_parks", "dataset_title": "National Parks", "title": "National Parks"}, {"dataset_id": "e9707baa-46e2-4ec4-99b6-86b1712e02de", "citation": "Global Administrative Areas. (2016). GADM database of Global Administrative Areas, version 2.8. http://www.gadm.org.", "type": "countries", "dataset_title": "Global Administrative Areas v 2.8", "title": "Political boundaries"}, {"dataset_id": "1603cb8b-918c-40ac-8732-ff0c20e1ed19", "citation": "TBA", "type": "mountains", "dataset_title": "Mountain Ranges", "title": "Mountain Ranges"}];
}]);
