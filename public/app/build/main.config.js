(function() {
    'use strict';

    angular
        .module('main')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main', {
                abastract: true,
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl as main',
                resolve: {
                    user: function(userService) {
                        return userService.getUser();
                    }
                }
            })
            .state('main.home', {
                url: '/home',
                templateUrl: 'app/main/main.home.html'
            })
    }
})();
