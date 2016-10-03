"use strict";

(function () {
    angular.module('searchPlayground')
    .controller('ChromeController',
    function($scope, $rootScope, $timeout,$state,$interval, $http, $uibModal, preloadImages){
        
        $scope.crumbs=[];
        $scope.loaded = false;
        $scope.currentLog=null;
        $scope.showTooltips=false;
        var masterMode=false;
        var firstLog=true;
        $rootScope.$on('log',function(evt,json){
            $scope.currentLog=json;
            
            if(firstLog){
                firstLog=false;
                $scope.showTooltips=true;
                $timeout(function(){
                    $scope.showTooltips=false;
                },3000);
            }
        });
        $rootScope.$on('masterStep',function(evt,step){
            $scope.masterStep=step;
        });
        var states = $state.get();
        $scope.stepCount = states.length;
        $scope.masterStep =$scope.stepCount; 
        
        $scope.next =function($event){
            if($event!==null){
             $event.preventDefault();
             }
             firstLog=true;
            $scope.currentLog= null;
            $scope.step = $scope.step + 1;
            var nextState=states[$scope.step].name;
            $scope.crumbs.push(nextState);
            $state.go(nextState);
        };
         $scope.prev = function($event){
             if($event!==null){
             $event.preventDefault();
             }
             firstLog=true;
            $scope.currentLog= null;
            $scope.step = $scope.step - 1;
            var nextState=states[$scope.step].name;
             $scope.crumbs.pop();
            $state.go(nextState);
        };
        $scope.goToStep = function(toStep){
            var nextState = null;
            while($scope.step<toStep){
                $scope.step = $scope.step + 1;
                nextState=states[$scope.step].name;
                $scope.crumbs.push(nextState);
            }
            if(nextState!==null){
             $state.go(nextState);
            }
        };
        $scope.step=0;
        $state.go('nocrumb-Splash');
        preloadImages.preload(['images/indexers.png','images/indexes.png','images/pricing.png','images/Azure Search.png']);
        $timeout(function(){
            $scope.loaded=true;
            $scope.next(null);            
        },2000);  
       
    });
})();