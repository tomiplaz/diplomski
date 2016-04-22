(function() {
    'use strict';

    angular
        .module('warrants')
        .controller('WarrantsValidationCtrl', WarrantsValidationCtrl);

    WarrantsValidationCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog', 'apiService', 'helperService'];
    function WarrantsValidationCtrl($scope, $state, warrants, dialogService, $mdDialog, apiService, helperService) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za pregled.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var warrant = warrants[$scope['warrants'].current];
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'w', warrant.id, 1, warrant);
            $mdDialog.show(rejectDialogObject);
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