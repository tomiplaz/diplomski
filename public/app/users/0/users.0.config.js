(function() {
    'use strict';

    angular
        .module('users.0')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('users.0', {
                abastract: true,
                url: '/0',
                templateUrl: 'app/users/0/users.0.html'
            })
            .state('users.0.home', {
                url: '/home',
                templateUrl: 'app/users/0/users.0.home.html',
                controller: 'Users0Ctrl as users0'
            })
    }
})();
