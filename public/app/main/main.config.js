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
            .state('main.validate', {
                url: '/validate',
                templateUrl: 'app/main/validate/validate.html',
                controller: 'ValidateCtrl as validate',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('nonvalidated');
                    }
                }
            })
            .state('main.approve', {
                url: '/approve',
                templateUrl: 'app/main/approve/approve.html',
                controller: 'ApproveCtrl as approve',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('approvable');
                    }
                }
            })
            .state('main.sent-requests', {
                url: '/sent-requests',
                templateUrl: 'app/main/sent-requests/sent-requests.html',
                controller: 'SentRequestsCtrl as sentRequests',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('user');
                    }
                }
            })
    }
})();
