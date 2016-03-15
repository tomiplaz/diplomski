(function() {
    'use strict';

    angular
        .module('login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$auth', '$state', 'toastService'];
    function LoginCtrl($auth, $state, toastService) {
        var vm = this;
        vm.login = login;
        vm.user = null;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                $state.go('main.home');
            }, function() {
                toastService.show("Greška tijekom autentikacije!", 3000);
            });
        }
    }
})();