(function() {
    'use strict';

    angular
        .module('main')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main', {
                abstract: true,
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl as main',
                resolve: {
                    user: function(userService) {
                        return userService.getUser();
                    }
                }
            })
            .state('main.home', {
                url: '/home',
                templateUrl: 'app/main/main.home.html'
            })
            .state('main.new-request', {
                url: '/new-request',
                templateUrl: 'app/main/new-request/new-request.html',
                controller: 'NewRequestCtrl as newRequest'
            })
            .state('main.sent-requests', {
                url: '/sent-requests',
                templateUrl: 'app/main/sent-requests/sent-requests.html'
            });
    }
})();
