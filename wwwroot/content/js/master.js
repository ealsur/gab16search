"use strict";

(function () {
    angular.module('searchPlayground', [])
        .config(['$httpProvider', function ($httpProvider) {
		    /*DISABLING CACHE FOR GETS*/
		    if (!$httpProvider.defaults.headers.get) {
		        $httpProvider.defaults.headers.get = {};
		    }
		    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
		}])
        .controller('MasterController',
    function($scope, $http){
       $scope.step = -1;
      
       $scope.next = function($event){
         $event && $event.preventDefault();  
        
         $http({
            method: 'POST',
            url: '/master/SetCurrent',
            data:(++$scope.step)
        }).then(function success(response) {
           if($scope.step==15){
               /*End*/
                $http({
                    method: 'POST',
                    url: '/master/Destroy'
                });
           }
        }, function error() {
            
        });
        
       };
       $scope.next(null);
    });
})();