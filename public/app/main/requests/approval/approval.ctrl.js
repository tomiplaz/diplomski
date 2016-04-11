(function() {
    'use strict';

    angular
        .module('main')
        .controller('RequestsApprovalCtrl', RequestsApprovalCtrl);

    RequestsApprovalCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsApprovalCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 2) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za odobravanje.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectRequestDialogObject = dialogService.getRejectRequestDialogObject($event, requestId, 2);
            $mdDialog.show(rejectRequestDialogObject);
        }

        function approve($event) {
            var requestId = requests[$scope['requests'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, requestId, 2);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();