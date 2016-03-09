(function() {
    angular
        .module('main')
        .controller('NewRequestNCtrl', NewRequestNCtrl);

    NewRequestNCtrl.$inject = ['$scope', 'dialogService', '$mdDialog', '$filter', '$mdToast'];
    function NewRequestNCtrl($scope, dialogService, $mdDialog, $filter, $mdToast) {
        var vm = this;

        vm.showDateTimeDialog = showDateTimeDialog;
        vm.showDocument = showDocument;
        vm.saveDocument = saveDocument;

        function showDateTimeDialog($event, label, ctrl, property) {
            var mindate = formatDate();
            var maxdate;

            if (property == 'startTime') {
                if (vm.endTime) {
                    maxdate = formatDate(vm.endTimeRaw);
                }
            } else if (property == 'endTime') {
                if (vm.startTime) {
                    mindate = formatDate(vm.startTimeRaw);
                }
            }

            var dateTimeDialogObject = dialogService.getDateTimeDialogObject($scope, $event, label, ctrl, property, mindate, maxdate);
            $mdDialog.show(dateTimeDialogObject);
        }

        function saveDocument() {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent("Dokument spremljen!")
                    .position('top right')
                    .hideDelay(1500)
            );
        }

        function showDocument($event) {
            var documentDialogObject = dialogService.getDocumentDialogObject($scope, $event);
            $mdDialog.show(documentDialogObject);
        }

        function formatDate(value) {
            return $filter('date')(!value ? new Date() : new Date(value), "yyyy/MM/dd");
        }
    }

    // explanation to text; test pdf and use ng-maxlength for each
})();