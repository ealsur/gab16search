'use strict';

(function () {
    angular.module('searchPlayground')
    .controller('StepController',
    function($scope, pubsubSystem){
       
    })
    .controller('SearchController',
    function($scope, pubsubSystem, $http){
       $scope.searchText = '';
       $scope.searching=false;
       $scope.filters=null;
       $scope.page = 1;
       $scope.getDescriptionByKey = function(key){
            switch(key){
                case "year": return "Año";
                case "rtAllCriticsRating": return "Puntaje";
                case "actorTags": return "Actores";
                case "genreTags": return "Género";
            }
            return key;  
         };
         $scope.curateUrl = function(url){
           return url.replace(/"/g,'');  
         };
         $scope.filter = function($event, filter, value){
             $event.preventDefault();
             if($scope.filters != null && $scope.filters.hasOwnProperty(filter)){
                 delete $scope.filters[filter];
             }
             else{
                 if($scope.filters==null){
                     $scope.filters={};
                 }
                 $scope.filters[filter] = value;
             }
             $scope.search($event);
         };
       $scope.next = function($event){
           $scope.page++;
           $scope.search($event);
       };
       $scope.prev = function($event){
           $scope.page--;
           $scope.search($event);
       };
       $scope.search = function($event){
         $event.preventDefault();  
         $scope.searching=true;
         $scope.results=null;
        
         $http({
            method: 'POST',
            url: '/search',
            data: {
                Text: $scope.searchText,
                Filters:$scope.filters,
                IncludeFacets:true,
                Page:$scope.page
            }
        }).then(function success(response) {
            $scope.results= response.data;
            pubsubSystem.publish('log', response.data);
            $scope.searching=false;
        }, function error() {
            ;
        });
       };
    })
    .controller('ScoringController',
    function($scope, pubsubSystem, $http){
       $scope.searchText = '';
       $scope.searching=false;
       $scope.page = 1;
    $scope.profile='';
         $scope.curateUrl = function(url){
           return url.replace(/"/g,'');  
         };
       $scope.next = function($event){
           $scope.page++;
           $scope.search($event);
       };
       $scope.prev = function($event){
           $scope.page--;
           $scope.search($event);
       };
       $scope.search = function($event){
         $event && $event.preventDefault();  
         $scope.searching=true;
         $scope.results=null;
        
         $http({
            method: 'POST',
            url: '/search',
            data: {
                Text: $scope.searchText,
                ScoringProfile:$scope.profile,
                ScoringParameter:($scope.profile=="Complete"?'Action':null),
                Page:$scope.page
            }
        }).then(function success(response) {
            $scope.results= response.data;
            pubsubSystem.publish('log', response.data);
            $scope.searching=false;
        }, function error() {
            ;
        });
       };
    })
    .controller('SuggestionController',
    function($scope, pubsubSystem, $http){
       $scope.noResults=false;
       $scope.loading=false;
       $scope.fuzzy = 'true';
       $scope.asyncSelected=null;
      $scope.getSuggestions = function(text){
         return $http({
            method: 'GET',
            url: '/search/suggest?term='+text+'&fuzzy='+$scope.fuzzy
        }).then(function (response) {
            pubsubSystem.publish('log', response.data);
            var map= response.data.Results.map(function(item){
                return item.Text;
            });
            return map;
        });
      };
    })
})();