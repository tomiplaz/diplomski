(function() {
    'use strict';

    angular
        .module('main')
        .controller('NewRequestCtrl', NewRequestCtrl);

    NewRequestCtrl.$inject = ['$scope', '$state', 'dialogService', '$mdDialog', 'helperService'];
    function NewRequestCtrl($scope, $state, dialogService, $mdDialog, helperService) {
        if ($scope['main'].user.type != 0) return $state.go('main.home');

        var vm = this;

        vm.name = $scope['main'].user.name;
        vm.surname = $scope['main'].user.surname;

        vm.showDateTimeDialog = showDateTimeDialog;
        vm.showDocumentDialog = showDocumentDialog;
        vm.sign = sign;
        vm.clear = clear;

        function showDateTimeDialog($event, label, property) {
            var mindate = helperService.formatDate(Date.now() + 7 * 86400000, 'yyyy/MM/dd');
            var maxdate;

            if (property == 'startTimestamp') {
                if (vm.endTimestamp) {
                    maxdate = helperService.formatDate(vm.endTimestampRaw, 'yyyy/MM/dd');
                }
            } else if (property == 'endTimestamp') {
                if (vm.startTimestamp) {
                    mindate = helperService.formatDate(vm.startTimestampRaw, 'yyyy/MM/dd');
                }
            }

            var data = {
                label: label,
                property: property,
                mindate: mindate,
                maxdate: maxdate
            };

            var dateTimeDialogObject = dialogService.getDateTimeDialogObject($scope, $event, data);
            $mdDialog.show(dateTimeDialogObject);
        }

        function showDocumentDialog($event) {
            var data = {
                userId: $scope['main'].user.id,
                type: vm.type,
                documentDate: helperService.formatDate(null, 'dd.MM.yyyy.'),
                name: vm.name,
                surname: vm.surname,
                workplace: vm.workplace,
                forPlace: vm.forPlace,
                forFaculty: vm.forFaculty,
                forSubject: vm.forSubject,
                projectLeader: vm.projectLeader,
                startTimestamp: vm.startTimestamp,
                endTimestamp: vm.endTimestamp,
                startTimestampRaw: vm.startTimestampRaw,
                endTimestampRaw: vm.endTimestampRaw,
                duration: helperService.getDuration(vm.startTimestampRaw, vm.endTimestampRaw),
                advancePayment: vm.advancePayment,
                description: vm.description,
                transportation: helperService.formatTransportation(vm.transportation),
                expensesResponsible: vm.expensesResponsible,
                expensesExplanation: vm.expensesExplanation,
                applicantSignature: vm.applicantSignature
            };

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
        }

        function sign($event) {
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'r', null, 0);
            $mdDialog.show(signatureDialogObject);
        }

        function clear() {
            vm.type = null;
            vm.name = null;
            vm.surname = null;
            vm.workplace = null;
            vm.forPlace = null;
            vm.forFaculty = null;
            vm.forSubject = null;
            vm.projectLeader = null;
            vm.advancePayment = null;
            vm.startTimestamp = null;
            vm.endTimestamp = null;
            vm.startTimestampRaw = null;
            vm.endTimestampRaw = null;
            vm.advancePayment = null;
            vm.description = null;
            vm.transportation = null;
            vm.expensesResponsible = null;
            vm.expensesExplanation = null;
            vm.applicantSignature = null;
        }
    }
})();