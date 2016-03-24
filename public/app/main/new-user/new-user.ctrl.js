(function() {
    'use strict';

    angular
        .module('main')
        .controller('NewUserCtrl', NewUserCtrl);

    NewUserCtrl.$inject = ['$scope', '$state', 'apiService'];
    function NewUserCtrl($scope, $state, apiService) {
        if ($scope['main'].user.type != 5) return $state.go('main.home');

        var vm = this;

        vm.clear = clear;
        vm.createUser = createUser;

        function clear() {
            vm.type = null;
            vm.name = null;
            vm.surname = null;
            vm.email = null;
            vm.password = null;
        }

        function createUser() {
            var data = {
                type: vm.type,
                name: vm.name,
                surname: vm.surname,
                email: vm.email,
                password: vm.password
            };

            apiService.createUser(data);
        }
    }
})();