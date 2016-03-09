(function() {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['Restangular', '$state'];
    function userService(Restangular, $state) {
        return {
            getUser: getUser
        };

        function getUser() {
            // change request structure?
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
            }, function(error) {
                // show error message?
                $state.go('login');
            });
        }
    }
})();