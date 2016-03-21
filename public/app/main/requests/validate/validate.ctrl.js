(function() {
    'use strict';

    angular
        .module('requests')
        .controller('ValidateCtrl', ValidateCtrl);

    ValidateCtrl.$inject = ['$scope', '$state', 'requests', 'helperService', 'dialogService', '$mdDialog', 'apiService'];
    function ValidateCtrl($scope, $state, requests, helperService, dialogService, $mdDialog, apiService) {
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

        function valid() {
            var requestId = requests[$scope['requests'].current].id;
            var data = {
                quality_check: true,
                quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
            };
            apiService.updateRequest(requestId, data, "Zahtjev uspješno prosljeđen!", true);
        }
    }
})();