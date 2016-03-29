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
                    user: function(apiService) {
                        return apiService.getUser();
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
            .state('main.new-user', {
                url: '/new-user',
                templateUrl: 'app/main/new-user/new-user.html',
                controller: 'NewUserCtrl as newUser'
            })
            .state('main.pending-warrants', {
                url: '/pending-warrants',
                templateUrl: 'app/main/pending-warrants/pending-warrants.html',
                controller: 'PendingWarrantsCtrl as pendingWarrants',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('user/pending');
                    }
                }
            });
    }
})();
