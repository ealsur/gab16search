'use strict';

(function () {
    angular.module('searchPlayground')
    .controller('ChromeController',
    function($scope, pubsubSystem, $timeout,$state){
        $scope.step=0;
       $scope.masterStep=0;
        $scope.crumbs=[];
        $scope.loaded = false;
        
        pubsubSystem.subscribe('masterStep',function(step){
            $scope.masterStep=step;
            $scope.$apply();
        });
        var states = $state.get();
        $scope.next = function(){
            console.log(states);
            
            $scope.step = $scope.step + 1;
            var nextState=states[$scope.step].name;
            console.log($scope.step);
            console.log(nextState);
             $scope.crumbs.push(nextState);
            $state.go(nextState);
        }
        
        $timeout(function(){
            $scope.loaded=true;
            $scope.next();
        },2000);
    });
})();