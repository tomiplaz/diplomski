(function() {
    'use strict';

    angular
        .module('main')
        .controller('WarrantsAccountingCtrl', WarrantsAccountingCtrl);

    WarrantsAccountingCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog'];
    function WarrantsAccountingCtrl($scope, $state, warrants, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 3) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za pregled.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var warrant = warrants[$scope['warrants'].current];
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'w', warrant.id, 3, warrant);
            $mdDialog.show(rejectDialogObject);
        }

        function approve($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'w', warrantId, 3);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();