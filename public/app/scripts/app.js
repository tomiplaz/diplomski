(function() {
    'use strict';

    angular
        .module('diplomski', ['ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer'])
        .controller('LoginController', LoginController)
        .config(configure);

    LoginController.$inject = ['users', 'Restangular'];
    function LoginController(users, Restangular) {
        var vm = this;
        vm.users = users;
        vm.login = login;

        function login() {
            Restangular.all('auth').customPOST({}, '', { email: vm.email, password: vm.password }, {});
        }
    }

    function configure($stateProvider, $urlRouterProvider, RestangularProvider, $mdThemingProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('light-green')
            .accentPalette('amber')
            .warnPalette('red')
            .backgroundPalette('grey');

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/partials/login.html',
                controller: 'LoginController as loginCtrl',
                resolve: {
                    users: function(Restangular) {
                        return Restangular.all('users').getList();
                    }/*,
                    token: function(Restangular) {
                        return Restangular.customPOST({}, 'auth', { email: "user0@app.com", password }, {});
                    }*/
                }
            });
    }
})();
