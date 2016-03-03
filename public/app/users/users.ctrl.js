(function() {
    'use strict';

    angular
        .module('users')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['user'];
    function UsersCtrl(user) {
        var vm = this;
        vm.user = user;
    }
})();
