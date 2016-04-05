"use strict";

(function () {
    angular.module('searchPlayground')
    .controller('ChromeController',
    function($scope, pubsubSystem, $timeout,$state,$interval, $http){
        $scope.step=0;
        $scope.masterStep=0;
        $scope.crumbs=[];
        $scope.loaded = false;
        $scope.currentLog=null;
        $scope.showTooltips=false;
        var firstLog=true;
        pubsubSystem.subscribe('log',function(json){
            $scope.currentLog=json;
            
            if(firstLog){
                firstLog=false;
                $scope.showTooltips=true;
                $timeout(function(){
                    $scope.showTooltips=false;
                },3000);
            }
            $scope.$apply();
        });
        pubsubSystem.subscribe('masterStep',function(step){
            $scope.masterStep=step;
            $scope.$apply();
        });
        var states = $state.get();
        $scope.next = function($event){
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
        $state.go(states[1].name);
        $timeout(function(){
            $scope.loaded=true;
            $scope.next(null);
        },2000);
        
        $interval(function(){
           $http({
            method: 'GET',
            url: '/master/GetCurrent'
        }).then(function success(response) {
           console.log(response);
        }, function error() {
            
        });
        },1000);
    });
})();