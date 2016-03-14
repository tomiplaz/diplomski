(function() {
    angular
        .module('main')
        .controller('NewRequestNCtrl', NewRequestNCtrl);

    NewRequestNCtrl.$inject = ['$scope', 'dialogService', '$mdDialog', '$filter'];
    function NewRequestNCtrl($scope, dialogService, $mdDialog, $filter) {
        var vm = this;

        vm.showDateTimeDialog = showDateTimeDialog;
        vm.showDocumentDialog = showDocumentDialog;
        vm.sign = sign;
        vm.clear = clear;

        function showDateTimeDialog($event, label, property) {
            var mindate = formatDate();
            var maxdate;

            if (property == 'startTimestamp') {
                if (vm.endTimestamp) {
                    maxdate = formatDate(vm.endTimestampRaw);
                }
            } else if (property == 'endTimestamp') {
                if (vm.startTimestamp) {
                    mindate = formatDate(vm.startTimestampRaw);
                }
            }

            var data = {
                label: label,
                ctrl: 'newRequestN',
                property: property,
                mindate: mindate,
                maxdate: maxdate
            };

            var dateTimeDialogObject = dialogService.getDateTimeDialogObject($scope, $event, data);
            $mdDialog.show(dateTimeDialogObject);
        }

        function showDocumentDialog($event) {
            var data = {
                type: 'n',
                documentDate: $filter('date')(new Date(), 'dd.MM.yyyy.'),
                name: vm.name,
                surname: vm.surname,
                workplace: vm.workplace,
                forPlace: vm.forPlace,
                forFaculty: vm.forFaculty,
                forSubject: vm.forSubject,
                startTimestamp: vm.startTimestamp,
                endTimestamp: vm.endTimestamp,
                startTimestampRaw: vm.startTimestampRaw,
                endTimestampRaw: vm.endTimestampRaw,
                purpose: vm.purpose,
                transportation: vm.transportation,
                expensesResponsible: vm.expensesResponsible,
                expensesExplanation: vm.expensesExplanation,
                applicantSignature: vm.applicantSignature
            };

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
        }

        function sign($event) {
            var data = {
                ctrl: 'newRequestN'
            };

            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, data);
            $mdDialog.show(signatureDialogObject);
        }

        function clear() {
            vm.name = null;
            vm.surname = null;
            vm.workplace = null;
            vm.forPlace = null;
            vm.forFaculty = null;
            vm.forSubject = null;
            vm.startTimestamp = null;
            vm.endTimestamp = null;
            vm.startTimestampRaw = null;
            vm.endTimestampRaw = null;
            vm.purpose = null;
            vm.transportation = null;
            vm.expensesResponsible = null;
            vm.expensesExplanation = null;
            vm.applicantSignature = null;
        }

        function formatDate(value) {
            return $filter('date')(!value ? new Date() : new Date(value), "yyyy/MM/dd");
        }
    }
})();