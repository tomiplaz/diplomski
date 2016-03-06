(function() {
    'use strict';

    angular
        .module('main')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['user'];
    function MainCtrl(user) {
        var vm = this;
        vm.user = user;
        vm.logout = logout;

        function logout() {
        }
    }
})();
