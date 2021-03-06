(function() {
    'use strict';

    angular
        .module('main')
        .controller('PendingWarrantsCtrl', PendingWarrantsCtrl);

    PendingWarrantsCtrl.$inject = ['$scope', 'warrants', 'helperService', 'apiService', 'dialogService', '$mdDialog', 'toastService'];
    function PendingWarrantsCtrl($scope, warrants, helperService, apiService, dialogService, $mdDialog, toastService) {
        var vm = this;

        vm.warrants = warrants;
        vm.current = null;
        vm.numOfWages = null;
        vm.wagesTotal = null;
        vm.numOfRoutes = null;
        vm.routesTotal = null;
        vm.numOfOther = null;
        vm.otherTotal = null;
        vm.allTotal = null;
        vm.attachments = null;

        vm.formatDate = helperService.formatDate;
        vm.selectWarrant = selectWarrant;
        vm.updateWagesTotal = updateWagesTotal;
        vm.addRoute = addRoute;
        vm.removeRoute = removeRoute;
        vm.updateRoutesTotal = updateRoutesTotal;
        vm.addOther = addOther;
        vm.removeOther = removeOther;
        vm.updateOtherTotal = updateOtherTotal;
        vm.removeAttachments = removeAttachments;
        vm.sign = sign;
        vm.clear = clear;
        vm.save = save;
        vm.showDocumentDialog = showDocumentDialog;

        init();

        function init() {
            if (vm.warrants.length > 0) {
                vm.current = 0;
                selectWarrant(0);
            }
        }

        function selectWarrant(index) {
            vm.current = index;

            var warrant = warrants[vm.current];

            vm.wage = warrant.wage;
            vm.numOfWages = helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp);
            vm.wagesTotal = warrant.wages_total == null ? 0 : warrant.wages_total;

            vm.numOfRoutes = helperService.getNumberOfRoutes(warrant);
            for (var i = 0; i < vm.numOfRoutes; i++) {
                vm['routesFrom' + i] = warrant['routes_from_' + i];
                vm['routesTo' + i] = warrant['routes_to_' + i];
                vm['routesTransportation' + i] = warrant['routes_transportation_' + i];
                vm['routesCost' + i] = warrant['routes_cost_' + i];
            }
            vm.routesTotal = warrant.routes_total == null ? 0 : warrant.routes_total;

            vm.numOfOther = helperService.getNumberOfOther(warrant);
            for (i = 0; i < vm.numOfOther; i++) {
                vm['otherDescription' + i] = warrant['other_description_' + i];
                vm['otherCost' + i] = warrant['other_cost_' + i];
            }
            vm.otherTotal = warrant.other_total == null ? 0 : warrant.other_total;

            vm.allTotal = warrant.all_total == null ? 0 : warrant.all_total;
            vm.report = warrant.report;

            apiService.getAttachments(warrant.id).then(function(attachments) {
                vm.attachments = attachments.length == 0 ? null : attachments;
            });

            vm.applicantSignature = warrant.applicant_signature;
        }

        function updateWagesTotal() {
            vm.wagesTotal = vm.wage * vm.numOfWages;
            updateAllTotal();
        }

        function addRoute() {
            vm.numOfRoutes++;
        }

        function removeRoute() {
            var i = --vm.numOfRoutes;
            vm['routesFrom' + i] = null;
            vm['routesTo' + i] = null;
            vm['routesTransportation' + i] = null;
            vm['routesCost' + i] = null;
        }

        function updateRoutesTotal() {
            vm.routesTotal = 0;
            for (var i = 0; i < vm.numOfRoutes; i++) {
                if (vm['routesCost' + i]) vm.routesTotal += vm['routesCost' + i];
            }
            updateAllTotal();
        }

        function addOther() {
            vm.numOfOther++;
        }

        function removeOther() {
            var i = --vm.numOfOther;
            vm['otherDescription' + i] = null;
            vm['otherCost' + i] = null;
            if (vm.numOfOther == 0) vm.otherTotal = 0;
        }

        function updateOtherTotal() {
            vm.otherTotal = 0;
            for (var i = 0; i < vm.numOfOther; i++) {
                if (vm['otherCost' + i]) vm.otherTotal += vm['otherCost' + i];
            }
            updateAllTotal();
        }

        function updateAllTotal() {
            vm.allTotal = vm.wagesTotal + vm.routesTotal + vm.otherTotal;
        }

        function removeAttachments() {
            vm.attachments = null;
        }

        function sign($event) {
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'w', null, 0);
            $mdDialog.show(signatureDialogObject);
        }

        function clear() {
            vm.wage = null;
            vm.wagesTotal = null;
            vm.routesTotal = null;
            vm.otherTotal = null;
            vm.allTotal = null;
            vm.report = null;
            vm.applicantSignature = null;
            vm.attachments = null;
            for (var i = 0; i < 7; i++) {
                vm['routesFrom' + i] = null;
                vm['routesTo' + i] = null;
                vm['routesTransportation' + i] = null;
                vm['routesCost' + i] = null;
            }
            for (i = 0; i < 4; i++) {
                vm['otherDescription' + i] = null;
                vm['otherCost' + i] = null;
            }
        }

        function save() {
            var warrantId = warrants[vm.current].id;
            var data = {
                wage: vm.wage,
                wages_total: vm.wagesTotal,
                routes_total: vm.routesTotal,
                other_total: vm.otherTotal,
                all_total: vm.allTotal,
                report: vm.report,
                applicant_signature: vm.applicantSignature
            };
            for (var i = 0; i < 7; i++) {
                data['routes_from_' + i] = !vm['routesFrom' + i] ? null : vm['routesFrom' + i];
                data['routes_to_' + i] = !vm['routesTo' + i] ? null : vm['routesTo' + i];
                data['routes_transportation_' + i] = !vm['routesTransportation' + i] ? null : vm['routesTransportation' + i];
                data['routes_cost_' + i] = !vm['routesCost' + i] ? null : vm['routesCost' + i];
            }
            for (i = 0; i < 4; i++) {
                data['other_description_' + i] = !vm['otherDescription' + i] ? null : vm['otherDescription' + i];
                data['other_cost_' + i] = !vm['otherCost' + i] ? null : vm['otherCost' + i];
            }

            if (vm.attachments) {
                if (!helperService.areFilesExtensionsValid(vm.attachments)) {
                    vm.attachments = null;
                    toastService.show("Odabrani neprihvatljivi tipovi datoteka! Prihvatljivi tipovi datoteka su .pdf, .png, .jpg, .jpeg.", 6000);
                } else if (!helperService.isFilesArrayUnderMaxSize(vm.attachments)) {
                    vm.attachments = null;
                    toastService.show("Odabrane datoteke zauzimaju previše memorije! Skup odabranih datoteka mora zauzimati manje od 10 MB.", 6000);
                } else {
                    apiService.postAttachments(warrantId, vm.attachments);
                    apiService.updateWarrant(warrantId, data, "Putni nalog spremljen!", false);

                }
            } else {
                apiService.deleteAttachments(warrantId);
                apiService.updateWarrant(warrantId, data, "Putni nalog spremljen!", false);
            }
        }

        function showDocumentDialog($event) {
            var warrant = warrants[vm.current];
            var data = {
                warrantId: warrant.id,
                mark: warrant.mark,
                type: warrant.type,
                documentDate: helperService.formatDate(warrant.document_date, 'dd.MM.yyyy.'),
                name: warrant.name,
                surname: warrant.surname,
                workplace: warrant.workplace,
                startDate: helperService.formatDate(warrant.start_timestamp, 'dd.MM.yyyy.'),
                forPlace: warrant.for_place,
                description: warrant.description,
                startTimestamp: helperService.formatDate(warrant.start_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                endTimestamp: helperService.formatDate(warrant.end_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                durationDays: helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp),
                transportation: warrant.transportation,
                expensesResponsible: warrant.expenses_responsible,
                advancePayment: warrant.advance_payment,
                approverStartSignature: warrant.approver_start_signature,
                wage: vm.wage,
                wagesTotal: vm.wagesTotal,
                numOfRoutes: vm.numOfRoutes,
                routesTotal: vm.routesTotal,
                numOfOther: vm.numOfOther,
                otherTotal: vm.otherTotal,
                allTotal: vm.allTotal,
                report: vm.report,
                attachments: vm.attachments,
                applicantSignature: vm.applicantSignature
            };
            for (var i = 0; i < vm.numOfRoutes; i++) {
                data['routesFrom' + i] = vm['routesFrom' + i];
                data['routesTo' + i] = vm['routesTo' + i];
                data['routesTransportation' + i] = vm['routesTransportation' + i];
                data['routesCost' + i] = vm['routesCost' + i];
            }
            for (i = 0; i < vm.numOfOther; i++) {
                data['otherDescription' + i] = vm['otherDescription' + i];
                data['otherCost' + i] = vm['otherCost' + i];
            }

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
        }
    }
})();
