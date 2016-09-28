"use strict";

(function () {
    angular.module('searchPlayground')
    .controller('StepController',
    function($scope, $rootScope){
    })
    .controller('SearchController',
    function($scope, $rootScope, $http, $timeout){
       $scope.searchText = '';
       $scope.searching=false;
       $scope.filters=null;
       $scope.showTooltips=false;
       var lastSearch='';
       $scope.page = 1;
       $scope.getDescriptionByKey = function(key){
            switch(key){
                case "Year": return "Año";
                case "Category": return "Categoría";
                case "TopLevelDomain": return "País";
            }
            return key;  
         };
         $scope.filter = function($event, filter, value){
             $event.preventDefault();
             if($scope.filters !== null && $scope.filters.hasOwnProperty(filter)){
                 delete $scope.filters[filter];
             }
             else{
                 if($scope.filters===null){
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
       var firstLog=true;
       $scope.search = function($event){
         $event.preventDefault();  
         $scope.searching=true;
         $scope.results=null;
        if(lastSearch!==$scope.searchText){
            $scope.page = 1;
        }
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
            $rootScope.$broadcast('log', response.data);
            if(firstLog){
                firstLog=false;
                $scope.showTooltips=true;
                $timeout(function(){
                    $scope.showTooltips=false;
                },3000);
            }
            $scope.searching=false;
        }, function error() {
            
        });
       };
    })
    .controller('ScoringController',
    function($scope, $rootScope, $http, $timeout){
       $scope.searchText = '';
       $scope.searching=false;
       $scope.showTooltips=false;
       $scope.page = 1;
    $scope.profile='';
    $scope.tag='';
    var lastSearch='';
          var firstLog=true;
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
        if(lastSearch!==$scope.searchText){
            $scope.page = 1;
        }
         $http({
            method: 'POST',
            url: '/search',
            data: {
                Text: $scope.searchText,
                ScoringProfile:$scope.profile,
                ScoringParameter:($scope.profile=="Completo"?$scope.tag:null),
                Page:$scope.page
            }
        }).then(function success(response) {
            if(firstLog){
                firstLog=false;
                $scope.showTooltips=true;
                $timeout(function(){
                    $scope.showTooltips=false;
                },3000);
            }
           $scope.results= response.data;
            $rootScope.$broadcast('log', response.data);
            $scope.searching=false;
        }, function error() {
            
        });
       };
    })
    .controller('SuggestionController',
    function($scope, $rootScope, $http, $timeout){
       $scope.noResults=false;
       $scope.loading=false;
       $scope.fuzzy = 'true';
       $scope.asyncSelected=null;
      $scope.getSuggestions = function(text){
         return $http({
            method: 'GET',
            url: '/search/suggest?term='+text+'&fuzzy='+$scope.fuzzy
        }).then(function (response) {
            $rootScope.$broadcast('log', response.data);
            var map= response.data.Results.map(function(item){
                return item.Text;
            });
            return map;
        });
      };
    })
    .controller('AdvancedController',
    function($scope, $rootScope, $http, $timeout){
       $scope.searchText = '';
       $scope.searching=false;
       $scope.showTooltips=false;
       $scope.page = 1;
       var firstLog=true;
   var lastSearch='';
          
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
        if(lastSearch!==$scope.searchText){
            $scope.page = 1;
        }
         $http({
            method: 'POST',
            url: '/search',
            data: {
                Text: $scope.searchText,
                QueryType : 'full',
                Page:$scope.page
            }
        }).then(function success(response) {
            if(firstLog){
                firstLog=false;
                $scope.showTooltips=true;
                $timeout(function(){
                    $scope.showTooltips=false;
                },3000);
            }
           $scope.results= response.data;
            $rootScope.$broadcast('log', response.data);
            $scope.searching=false;
        }, function error() {
            
        });
       };
    })
    .controller('SearchTwitterController',
    function($scope, $rootScope, $http, $timeout){
       $scope.searchText = '';
       $scope.searching=false;
       $scope.filters=null;
       $scope.page = 1;
       $scope.showTooltips=false;
       var firstLog = true;
       var lastSearch='';
       $scope.getDescriptionByKey = function(key){
            switch(key){
                case "account": return "Cuenta";
                case "hashtags": return "Hashtags";
            }
            return key;  
         };
         $scope.filter = function($event, filter, value){
             $event.preventDefault();
             if($scope.filters !== null && $scope.filters.hasOwnProperty(filter)){
                 delete $scope.filters[filter];
             }
             else{
                 if($scope.filters===null){
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
        if(lastSearch!==$scope.searchText){
            $scope.page = 1;
        }
         $http({
            method: 'POST',
            url: '/search',
            data: {
                Index:"tweets",
                Text: $scope.searchText,
                Filters:$scope.filters,
                IncludeFacets:true,
                Page:$scope.page
            }
        }).then(function success(response) {
            if(firstLog){
                firstLog=false;
                $scope.showTooltips=true;
                $timeout(function(){
                    $scope.showTooltips=false;
                },3000);
            }
            $scope.results= response.data;
            $rootScope.$broadcast('log', response.data);
            $scope.searching=false;
        }, function error() {
            
        });
       };
    });
})();