(function() {
    'use strict';

    angular
        .module('requests')
        .controller('ValidationCtrl', ValidationCtrl);

    ValidationCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function ValidationCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za validaciju.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectRequestDialogObject = dialogService.getRejectRequestDialogObject($event, requestId, 1);
            $mdDialog.show(rejectRequestDialogObject);
        }

        function valid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var markRequestDialogObject = dialogService.getMarkRequestDialogObject($event, requestId);
            $mdDialog.show(markRequestDialogObject);
        }
    }
})();