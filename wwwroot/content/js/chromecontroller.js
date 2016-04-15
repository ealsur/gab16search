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
        preloadImages.preload(['images/indexers.png','images/index.gif','images/pricing.png']);
        var start = function(){
            
          $timeout(function(){
            $scope.loaded=true;
            if(!masterMode){
                $scope.next(null);
            }
            else{
                $scope.goToStep($scope.masterStep);
            }
        },2000);  
            
        };
        
        var modalInstance = $uibModal.open({
            templateUrl: 'modalTwitter.html',
            controller: 'ModalTwitterController'
            }); 
        modalInstance.result.then(start,start);
        var interval = $interval(function(){
           $http({
            method: 'GET',
            url: '/master/GetCurrent'
        }).then(function success(response) {
           if(response.data.current !== null){
               masterMode=true;
               if($scope.step==$scope.masterStep-1){
                   $scope.next(null);
               }               
               $scope.masterStep = response.data.current;
           }
           else{
               $interval.cancel(interval);
               /*No master running*/
           }
        });
        },2000);
    })
    .controller('ModalTwitterController',
    function ($scope, $uibModalInstance, $http) {
        $scope.loading=false;
        $scope.account='';
        $scope.ok = function () {
            $scope.loading=true;
            
            $http({
                method: 'POST',
                url: '/master/twitter',
                params:{account:$scope.account}
            }).then(function success(response) {
                $scope.loading=false;
                $uibModalInstance.close();
            }, function error() {
                $uibModalInstance.close();    
            });
            
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    })
    ;
})();