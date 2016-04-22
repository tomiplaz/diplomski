(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsValidationCtrl', RequestsValidationCtrl);

    RequestsValidationCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsValidationCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za pregled.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'r', requestId, 1);
            $mdDialog.show(rejectDialogObject);
        }

        function valid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var markRequestDialogObject = dialogService.getMarkRequestDialogObject($event, requestId);
            $mdDialog.show(markRequestDialogObject);
        }
    }
})();