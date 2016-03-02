(function() {
    'use strict';

    angular
        .module('login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$auth', '$state'];
    function LoginCtrl($auth, $state) {
        var vm = this;
        vm.login = login;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                alert("!");
            });
        }
    }
})();