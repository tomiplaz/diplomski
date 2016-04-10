(function() {
    'use strict';

    angular
        .module('requests')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main.requests', {
                abstract: true,
                url: '/requests',
                templateUrl: 'app/main/requests/requests.html',
                controller: 'RequestsCtrl as requests'
            })
            .state('main.requests.validation', {
                url: '/validation',
                templateUrl: 'app/main/requests/validation/validation.html',
                controller: 'ValidationCtrl as validation',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('nonvalidated');
                    }
                }
            })
            .state('main.requests.approval', {
                url: '/approval',
                templateUrl: 'app/main/requests/approval/approval.html',
                controller: 'ApprovalCtrl as approval',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('approvable');
                    }
                }
            })
            .state('main.requests.sent', {
                url: '/sent',
                templateUrl: 'app/main/requests/sent/sent.html',
                controller: 'SentCtrl as sent',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('user');
                    }
                }
            });
    }
})();
