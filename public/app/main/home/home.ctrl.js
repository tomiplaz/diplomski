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
            case 4:
                apiService.getRequests($scope['main'].user.type == 0 ? 'user' : null).then(function(requests) {
                    vm.requests = requests;
                    vm.pendingRequests = _.filter(requests, function(request) {
                        return request.quality_check == null ||
                            (request.quality_check && request.approved == null);
                    });
                    vm.approvedRequests = _.filter(requests, function(request) {
                        return request.approved;
                    });
                    vm.rejectedRequests = _.filter(requests, function(request) {
                        return request.quality_check == false || request.approved == false;
                    });
                });
                apiService.getWarrants($scope['main'].user.type == 0 ? 'user' : null).then(function(warrants) {
                    vm.warrants = warrants;
                    vm.pendingWarrants = _.filter(warrants, function(warrant) {
                        return warrant.quality_check == null ||
                            (warrant.quality_check && warrant.accounting_check == null) ||
                            (warrant.accounting_check && warrant.approved == null);
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
                apiService.getRequests().then(function(requests) {
                    vm.requests = requests;
                    vm.pendingRequests = _.filter(requests, function(request) {
                        return request.quality_check == null;
                    });
                    vm.approvedRequests = _.filter(requests, function(request) {
                        return request.quality_check;
                    });
                    vm.rejectedRequests = _.filter(requests, function(request) {
                        return request.quality_check == false;
                    });
                });
                apiService.getWarrants().then(function(warrants) {
                    vm.warrants = warrants;
                    vm.pendingWarrants = _.filter(warrants, function(warrant) {
                        return warrant.quality_check == null;
                    });
                    vm.approvedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.quality_check;
                    });
                    vm.rejectedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.quality_check == false;
                    });
                });
                break;
            case 2:
                apiService.getRequests().then(function(requests) {
                    vm.requests = requests;
                    vm.pendingRequests = _.filter(requests, function(request) {
                        return request.quality_check && request.approved == null;
                    });
                    vm.approvedRequests = _.filter(requests, function(request) {
                        return request.approved;
                    });
                    vm.rejectedRequests = _.filter(requests, function(request) {
                        return request.approved == false;
                    });
                });
                apiService.getWarrants().then(function(warrants) {
                    vm.warrants = warrants;
                    vm.pendingWarrants = _.filter(warrants, function(warrant) {
                        return warrant.accounting_check && warrant.approved == null;
                    });
                    vm.approvedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.approved;
                    });
                    vm.rejectedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.approved == false;
                    });
                });
                break;
            case 3:
                apiService.getWarrants().then(function(warrants) {
                    vm.warrants = warrants;
                    vm.pendingWarrants = _.filter(warrants, function(warrant) {
                        return warrant.quality_check && warrant.accounting_check == null;
                    });
                    vm.approvedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.accounting_check;
                    });
                    vm.rejectedWarrants = _.filter(warrants, function(warrant) {
                        return warrant.accounting_check == false;
                    });
                });
                break;
            default:
                break;
        }
    }
})();
