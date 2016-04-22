(function() {
    'use strict';

    angular
        .module('main')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', 'apiService'];
    function HomeCtrl($scope, apiService) {
        var vm = this;

        switch ($scope['main'].user.type) {
            case 0:
                apiService.getRequests('user').then(function(requests) {
                    vm.requests = requests;
                    vm.pendingRequests = _.filter(requests, function(request) {
                        return request.approved == null;
                    });
                    vm.approvedRequests = _.filter(requests, function(request) {
                        return request.approved;
                    });
                    vm.rejectedRequests = _.filter(requests, function(request) {
                        return request.quality_check == false || request.approved == false;
                    });
                });

                apiService.getWarrants('user').then(function(warrants) {
                    vm.warrants = warrants;
                    vm.pendingWarrants = _.filter(warrants, function(warrant) {
                        return warrant.approved == null;
                    });
                    vm.approvedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.approved;
                    });
                    vm.rejectedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.quality_check == false || warrant.accounting_check == false || warrant.approved == false;
                    });
                });

                break;
            case 1:
                apiService.getRequests('nonvalidated').then(function(requests) {
                    vm.nonvalidatedRequests = requests;
                });

                apiService.getWarrants('nonvalidated').then(function(warrants) {
                    vm.nonvalidatedWarrants = warrants;
                });

                break;
            case 2:
                apiService.getRequests('approvable').then(function(requests) {
                    vm.approvableRequests = requests;
                });

                apiService.getWarrants('approvable').then(function(warrants) {
                    vm.approvableWarrants = warrants;
                });

                break;
            case 3:
                apiService.getWarrants('nonaccounted').then(function(warrants) {
                    vm.nonaccountedWarrants = warrants;
                });

                break;
            default:
                break;
        }
    }
})();
