(function() {
    'use strict';

    angular
        .module('users')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('users', {
                abastract: true,
                url: '/users',
                templateUrl: 'app/users/users.html',
                controller: 'UsersCtrl as users',
                resolve: {
                    user: function(userService) {
                        return userService.getUser();
                    }
                }
            });
    }
})();
