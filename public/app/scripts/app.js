(function() {
    'use strict';

    angular
        .module('diplomski', ['ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer'])
        .controller('LoginController', LoginController)
        .controller('UsersController', UsersController)
        .config(configure);

    LoginController.$inject = ['$auth', '$state', 'Restangular'];
    function LoginController($auth, $state, Restangular) {
        var vm = this;
        vm.login = login;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                userService.getUser();
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
            .state('user', {
                url: '/user',
                abstract: true,
                templateUrl: 'app/partials/user.html',
                controller: 'UserController as userCtrl'
            })
            .state('user.0', {
                url: '/0',
                templateUrl: 'app/partials/user.0.html',
                controller: 'User0Controller as user0Ctrl'
            })
            .state('user.1', {
                url: '/1',
                templateUrl: 'app/partials/user.1.html',
                controller: 'User0Controller as user0Ctrl'
            })
            .state('user.2', {
                url: '/2',
                templateUrl: 'app/partials/user.2.html',
                controller: 'User0Controller as user0Ctrl'
            })
            .state('user.3', {
                url: '/3',
                templateUrl: 'app/partials/user.3.html',
                controller: 'User0Controller as user0Ctrl'
            })
    }
})();
