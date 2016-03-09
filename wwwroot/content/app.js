'use strict';

(function () {
    angular.module('searchPlayGround', ['ui.bootstrap', 'ngCookies'])
        .config(['$httpProvider', function ($httpProvider) {
		    /*CONFIGURO EL PROVIDER PARA NUNCA CACHEAR RESPUESTAS DE GET*/
		    if (!$httpProvider.defaults.headers.get) {
		        $httpProvider.defaults.headers.get = {};
		    }
		    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
		}])
        /****** SERVICES *******/
        ;
})();