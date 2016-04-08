(function() {
    'use strict';

    angular
        .module('warrants')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main.warrants', {
                abstract: true,
                url: '/warrants',
                templateUrl: 'app/main/warrants/warrants.html',
                controller: 'WarrantsCtrl as warrants'
            })
            .state('main.warrants.validation', {
                url: '/validation',
                templateUrl: 'app/main/warrants/validation/validation.html',
                controller: 'ValidationCtrl as validation',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('nonvalidated');
                    }
                }
            })
            .state('main.warrants.approval', {
                url: '/approval',
                templateUrl: 'app/main/warrants/approval/approval.html',
                controller: 'ApprovalCtrl as approval',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('approvable');
                    }
                }
            })
            .state('main.warrants.accounting', {
                url: '/accounting',
                templateUrl: 'app/main/warrants/accounting/accounting.html',
                controller: 'AccountingCtrl as accounting',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('nonaccounted');
                    }
                }
            })
            .state('main.warrants.sent', {
                url: '/sent',
                templateUrl: 'app/main/warrants/sent/sent.html',
                controller: 'SentCtrl as sent',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('user/sent');
                    }
                }
            });
    }
})();
