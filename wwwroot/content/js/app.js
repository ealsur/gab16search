"use strict";

(function () {
    angular.module('searchPlayground', ['ui.bootstrap', 'ngCookies', 'ui.router','jsonFormatter','ngSanitize'])
        .config(['$httpProvider', function ($httpProvider) {
		    /*DISABLING CACHE FOR GETS*/
		    if (!$httpProvider.defaults.headers.get) {
		        $httpProvider.defaults.headers.get = {};
		    }
		    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
		}])
        .config(function($stateProvider, $urlRouterProvider){
            /*STATE PROVIDER*/
            $stateProvider
                .state('nocrumb-Splash', {
                    url: '',
                    templateUrl: '/Splash',
                    controller: 'StepController'
                })
                .state('nocrumb-SearchBox', {
                    url: '/searchbox',
                    templateUrl: '/SearchBox',
                    controller: 'StepController'
                })
                .state('nocrumb-Intro', {
                    url: '/intro',
                    templateUrl: '/Intro',
                    controller: 'StepController'
                })
                .state('Indexes', {
                    url: '/indexes',
                    templateUrl: '/Indexes',
                    controller: 'StepController'
                })
                .state('Facets & Filters', {
                    url: '/facets',
                    templateUrl: '/facets',
                    controller: 'SearchController' 
                })
                .state('Scoring', {
                    url: '/scoring',
                    templateUrl: '/scoring',
                    controller: 'ScoringController'
                })
                .state('nocrumb-Indexers', {
                    url: '/indexers',
                    templateUrl: '/Indexers',
                    controller: 'StepController'
                })
                .state('Suggestions', {
                    url: '/suggestions',
                    templateUrl: '/suggestions',
                    controller: 'SuggestionController'
                })
                .state('Advanced Querying', {
                    url: '/advanced',
                    templateUrl: '/advanced',
                    controller: 'AdvancedController'
                })
                .state('Analytics', {
                    url: '/analytics',
                    templateUrl: '/analytics',
                    controller: 'StepController'
                })
                .state('nocrumb-Free!', {
                    url: '/try',
                    templateUrl: '/try',
                    controller: 'StepController'
                })
                .state('Offering', {
                    url: '/pricing',
                    templateUrl: '/pricing',
                    controller: 'StepController'
                })
                 .state('nocrumb-Gracias!', {
                    url: '/end',
                    templateUrl: '/end',
                    controller: 'StepController'
                })
                 .state('nocrumb-Twitter!', {
                    url: '/twitter',
                    templateUrl: '/twitter',
                    controller: 'SearchTwitterController'
                });
        })
        .factory('preloadImages', function(){
            return {
                preload:function(imgArray){
                    angular.forEach(imgArray, function (img) {
                        var imgO = new Image();
                        imgO.src = img;
                    });
                }
            }
        });
})();