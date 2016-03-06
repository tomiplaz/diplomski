(function() {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['Restangular'];
    function userService(Restangular) {
        return {
            getUser: getUser
        };

        function getUser() {
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
            });
        }
    }
})();