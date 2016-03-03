(function() {
    'use strict';

    angular
        .module('users.1')
        .controller('Users1Ctrl', Users1Ctrl);

    Users1Ctrl.$inject = [];
    function Users1Ctrl() {
        var vm = this;
        vm.hey = 'Hey!';
    }
})();
