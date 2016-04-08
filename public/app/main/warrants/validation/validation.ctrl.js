(function() {
    'use strict';

    angular
        .module('warrants')
        .controller('ValidationCtrl', ValidationCtrl);

    ValidationCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog', 'apiService', 'helperService'];
    function ValidationCtrl($scope, $state, warrants, dialogService, $mdDialog, apiService, helperService) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za validaciju.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            /*var rejectRequestDialogObject = dialogService.getRejectRequestDialogObject($event, requestId, 1);
            $mdDialog.show(rejectRequestDialogObject);*/
        }

        function valid() {
            var warrantId = warrants[$scope['warrants'].current].id;
            var data = {
                quality_check: true,
                quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
            };
            apiService.updateWarrant(warrantId, data, "Putni nalog prosljeđen!", true);
        }
    }
})();