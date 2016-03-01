'use strict';

angular
    .module('diplomski', ['ui.router', 'restangular', 'ngMaterial'])
    .controller('LoginController', LoginController)
    .config(configure);

LoginController.$inject = ['users'];
function LoginController(users) {
    var vm = this;
    vm.yolo = function() { alert("Yolo!"); };
    vm.users = users;
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
            templateUrl: 'partials/login.html',
            controller: 'LoginController as loginCtrl',
            resolve: {
                users: function(Restangular) {
                    return Restangular.all('users').getList();
                }
            }
        });
}