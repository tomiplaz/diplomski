(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);

    function configure($urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('indigo')
            .warnPalette('amber')
            .backgroundPalette('grey');

        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');
    }
})();