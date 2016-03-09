(function() {
    angular
        .module('main')
        .controller('NewRequestNCtrl', NewRequestNCtrl);

    NewRequestNCtrl.$inject = ['$scope', 'dialogService', '$mdDialog', '$filter', 'Restangular', 'toastService'];
    function NewRequestNCtrl($scope, dialogService, $mdDialog, $filter, Restangular, toastService) {
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
            var newRequestN = {
                document_date: $filter('date')(new Date(), 'yyyy-MM-dd'),
                name: vm.name,
                surname: vm.surname,
                workplace: vm.workplace,
                for_place: vm.forPlace,
                for_faculty: vm.forFaculty,
                for_subject: vm.forSubject,
                start_timestamp: $filter('date')(new Date(vm.startTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                end_timestamp: $filter('date')(new Date(vm.endTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                purpose: vm.purpose,
                transportation: vm.transportation,
                expenses_responsible: vm.expensesResponsible,
                expenses_explanation: vm.expensesExplanation
            };

            Restangular.all('request-ns').post(newRequestN).then(function() {
                toastService.show("Dokument spremljen!");
            }, function() {
                toastService.show("Greška tijekom spremanja dokumenta!", 3000);
            });
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