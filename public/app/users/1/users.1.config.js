(function() {
    'use strict';

    angular
        .module('users.1')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('users.1', {
                abastract: true,
                url: '/1',
                templateUrl: 'app/users/1/users.1.html'
            })
            .state('users.1.home', {
                url: '/home',
                templateUrl: 'app/users/1/users.1.home.html',
                controller: 'Users1Ctrl as users1'
            })
    }
})();
