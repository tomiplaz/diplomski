(function() {
    'use strict';

    angular
        .module('users.0')
        .controller('Users0Ctrl', Users0Ctrl);

    Users0Ctrl.$inject = [];
    function Users0Ctrl() {
        var vm = this;
        vm.hey = 'Hey!';
    }
})();
