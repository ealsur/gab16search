'use strict';

(function () {
    angular.module('searchPlayground')
    .controller('ChromeController',
    function($scope, pubsubSystem){
        $scope.step='';
        pubsubSystem.subscribe('stepChange',function(step){
            $scope.step=step;
            $scope.$apply();
        });
    });
})();