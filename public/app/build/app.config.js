(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);

    function configure($urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('light-green')
            .accentPalette('amber')
            .warnPalette('red')
            .backgroundPalette('grey');

        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');
    }
})();