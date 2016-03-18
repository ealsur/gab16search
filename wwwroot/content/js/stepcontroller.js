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
       $scope.search = function($event){
         $event.preventDefault();  
         $scope.searching=true;
         
         $scope.results=null;
         
         $scope.curateUrl = function(url){
           return url.replace(/"/g,'');  
         };
         
         $http({
            method: 'POST',
            url: '/search',
            data: {
                Text: $scope.searchText,
                IncludeFacets:true
            }
        }).then(function success(response) {
            $scope.results= response.data;
            console.log(response.data);
            $scope.searching=false;
        }, function error() {
            ;
        });
       };
    })
})();