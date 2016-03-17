'use strict';

(function () {
    angular.module('searchPlayground')
    .controller('ChromeController',
    function($scope, pubsubSystem, $timeout,$state){
        $scope.step=0;
        $scope.masterStep=0;
        $scope.loaded = false;
        pubsubSystem.subscribe('stepChange',function(step){
            $scope.step=step;
        });
        pubsubSystem.subscribe('masterStep',function(step){
            $scope.masterStep=step;
        });
        $timeout(function(){
            $scope.loaded=true;
            $state.go('intro');
        },2000);
    });
})();