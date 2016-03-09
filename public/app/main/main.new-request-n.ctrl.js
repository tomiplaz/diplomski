(function() {
    angular
        .module('main')
        .controller('NewRequestNCtrl', NewRequestNCtrl);

    NewRequestNCtrl.$inject = ['$scope', 'dialogService', '$mdDialog'];
    function NewRequestNCtrl($scope, dialogService, $mdDialog) {
        var vm = this;

        vm.showDateTimeDialog = showDateTimeDialog;

        function showDateTimeDialog($event, label, ctrl, property) {
            var dialogObject = dialogService.getDialogObject($scope, $event, label, ctrl, property);
            $mdDialog.show(dialogObject);
        }
    }
})();