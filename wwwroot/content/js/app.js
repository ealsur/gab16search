'use strict';

(function () {
    angular.module('searchPlayground', ['ui.bootstrap', 'ngCookies', 'ui.router'])
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
                .state('intro', {
                    url: '/intro',
                    templateUrl: '/Intro',
                    controller: 'StepController',
                    resolve:{step:function(){return 1;}}
                })
                .state('indexes', {
                    url: '/indexes',
                    templateUrl: '/Indexes',
                    controller: 'StepController',
                    resolve:{step:function(){return 2;}}
                })
                .state('facets', {
                    url: '/facets',
                    templateUrl: '/facets',
                    controller: 'StepController'
                    ,
                    resolve:{step:function(){return 3;}}
                })
                .state('scoring', {
                    url: '/scoring',
                    templateUrl: '/scoring',
                    controller: 'StepController',
                    resolve:{step:function(){return 4;}}
                })
                .state('indexers', {
                    url: '/indexes',
                    templateUrl: '/Indexes',
                    controller: 'StepController',
                    resolve:{step:function(){return 5;}}
                })
                .state('suggestions', {
                    url: '/suggestions',
                    templateUrl: '/suggestions',
                    controller: 'StepController',
                    resolve:{step:function(){return 6;}}
                })
                .state('advanced', {
                    url: '/advanced',
                    templateUrl: '/advanced',
                    controller: 'StepController',
                    resolve:{step:function(){return 7;}}
                })
                .state('analytics', {
                    url: '/indexes',
                    templateUrl: '/Indexes',
                    controller: 'StepController',
                    resolve:{step:function(){return 8;}}
                })
                 .state('end', {
                    url: '/end',
                    templateUrl: '/end',
                    controller: 'StepController',
                    resolve:{step:function(){return 9;}}
                })
        })
        /****** SERVICES *******/
        .factory('pubsubSystem', function () {
            var service = {};
            var eventTypes = {}, subscriberID = -1;
            var firedEvents = {};
            service.subscribe = function (eventType, func) {
                if (firedEvents[eventType]) {
                    func(firedEvents[eventType]);
                    return false;
                }
                if (!eventTypes[eventType]) {
                    eventTypes[eventType] = [];
                }
                var subscriber = (++subscriberID).toString();
                eventTypes[eventType].push({
                    subscriber: subscriber,
                    func: func
                });
                return subscriber;
            };
            service.publish = function (eventType, args) {
                firedEvents[eventType] = args;
                if (!eventTypes[eventType]) {
                    return false;
                }

                setTimeout(function () {
                    var subscribers = eventTypes[eventType],
                        len = subscribers ? subscribers.length : 0;

                    while (len--) {
                        subscribers[len].func(args);
                    }
                }, 0);
                return true;
            };
            return service;
        });
})();