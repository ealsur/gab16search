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
                .state('Intro', {
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
                .state('Indexers', {
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
                .state('Free!', {
                    url: '/try',
                    templateUrl: '/try',
                    controller: 'StepController'
                })
                 .state('Gracias!', {
                    url: '/end',
                    templateUrl: '/end',
                    controller: 'StepController'
                })
                 .state('Twitter!', {
                    url: '/twitter',
                    templateUrl: '/twitter',
                    controller: 'SearchTwitterController'
                });
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