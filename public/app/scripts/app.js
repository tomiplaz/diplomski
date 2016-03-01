(function() {
    'use strict';

    angular
        .module('diplomski', ['ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer'])
        .controller('LoginController', LoginController)
        .controller('UsersController', UsersController)
        .config(configure);

    LoginController.$inject = ['$auth', '$state'];
    function LoginController($auth, $state) {
        var vm = this;
        vm.login = login;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function(result) {
                $state.go('users', {});
            });
        }
    }

    UsersController.$inject = ['users'];
    function UsersController(users) {
        var vm = this;
        vm.users = users;
    }

    function configure($stateProvider, $urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('light-green')
            .accentPalette('amber')
            .warnPalette('red')
            .backgroundPalette('grey');

        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/partials/login.html',
                controller: 'LoginController as loginCtrl'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'app/partials/users.html',
                controller: 'UsersController as usersCtrl',
                resolve: {
                    users: function(Restangular) {
                        return Restangular.all('users').getList();
                    }
                }
            });
    }
})();
