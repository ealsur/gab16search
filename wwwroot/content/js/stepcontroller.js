'use strict';

(function () {
    angular.module('searchPlayground')
    .controller('StepController',
    function($scope, step, pubsubSystem){
        pubsubSystem.publish('stepChange',step);
    });
})();