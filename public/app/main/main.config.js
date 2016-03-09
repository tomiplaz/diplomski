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
            .state('main.new-request-n', {
                url: '/new-request-n',
                templateUrl: 'app/main/main.new-request-n.html',
                controller: 'NewRequestNCtrl as newRequestN'
            })
            .state('main.new-request-z', {
                url: '/new-request-z',
                templateUrl: 'app/main/main.new-request-z.html'
            })
            .state('main.sent-requests', {
                url: '/sent-requests',
                templateUrl: 'app/main/main.sent-requests.html'
            });
    }
})();
