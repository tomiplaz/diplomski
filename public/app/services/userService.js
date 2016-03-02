(function() {
    'use strict';

    angular
        .module('diplomski')
        .factory('userService', userService);

    userService.$inject = ['Restangular'];
    function userService(Restangular) {
        var user = null;

        return {
            getUser: getUser,
            setUser: setUser
        };

        function getUser() {
            if (!user) {
                return Restangular.all('auth').customGET('user').then(function(res) {
                    user = res.user;
                });
            }
            return user;
        }

        function setUser() {
            Restangular.all('auth').customGET('user').then(function(res) {
                user = res.user;
            });
        }
    }
})();