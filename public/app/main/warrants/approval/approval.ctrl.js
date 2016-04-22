(function() {
    'use strict';

    angular
        .module('main')
        .controller('WarrantsApprovalCtrl', WarrantsApprovalCtrl);

    WarrantsApprovalCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog'];
    function WarrantsApprovalCtrl($scope, $state, warrants, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 2) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za odobravanje.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var warrant = warrants[$scope['warrants'].current];
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'w', warrant.id, 2, warrant);
            $mdDialog.show(rejectDialogObject);
        }

        function approve($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'w', warrantId, 2);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();