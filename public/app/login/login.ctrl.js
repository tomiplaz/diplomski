(function() {
    'use strict';

    angular
        .module('login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$auth', '$state', 'userService'];
    function LoginCtrl($auth, $state, userService) {
        var vm = this;
        vm.login = login;
        vm.user = null;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                userService.getUser().then(function(user) {
                    $state.go('users.' + user.type + '.home');
                });
            });
        }
    }
})();