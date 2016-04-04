(function() {
    'use strict';

    angular
        .module('main')
        .controller('PendingWarrantsCtrl', PendingWarrantsCtrl);

    PendingWarrantsCtrl.$inject = ['warrants', 'helperService', 'apiService', 'dialogService', '$mdDialog'];
    function PendingWarrantsCtrl(warrants, helperService, apiService, dialogService, $mdDialog) {
        var vm = this;

        vm.warrants = warrants;
        vm.current = 0;
        vm.numOfWages = 0;
        vm.wagesTotal = 0;
        vm.numOfRoutes = 2;
        vm.routesTotal = 0;
        vm.numOfOther = 0;
        vm.otherTotal = 0;
        vm.allTotal = 0;

        vm.formatDate = helperService.formatDate;
        vm.selectWarrant = selectWarrant;
        vm.updateWagesTotal = updateWagesTotal;
        vm.addRoute = addRoute;
        vm.removeRoute = removeRoute;
        vm.updateRoutesTotal = updateRoutesTotal;
        vm.addOther = addOther;
        vm.removeOther = removeOther;
        vm.updateOtherTotal = updateOtherTotal;
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
            vm.wagesTotal = warrant.wages_total;

            vm.numOfRoutes = helperService.getNumberOfRoutes(warrant);
            for (var i = 0; i < vm.numOfRoutes; i++) {
                vm['routesFrom' + i] = warrant['routes_from_' + i];
                vm['routesTo' + i] = warrant['routes_to_' + i];
                vm['routesTransportation' + i] = warrant['routes_transportation_' + i];
                vm['routesCost' + i] = warrant['routes_cost_' + i];
            }
            vm.routesTotal = warrant.routes_total;

            vm.numOfOther = helperService.getNumberOfOther(warrant);
            for (i = 0; i < vm.numOfOther; i++) {
                vm['otherDescription' + i] = warrant['other_description_' + i];
                vm['otherCost' + i] = warrant['other_cost_' + i];
            }
            vm.otherTotal = warrant.other_total;

            vm.allTotal = warrant.all_total;
            vm.report = warrant.report;
        }

        function updateWagesTotal() {
            vm.wagesTotal = vm.wage * vm.numOfWages;
            updateAllTotal();
        }

        function addRoute() {
            vm.numOfRoutes++;
        }

        function removeRoute() {
            vm.numOfRoutes--;
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
            vm.numOfOther--;
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

        function save() {
            var warrantId = warrants[vm.current].id;
            var data = {
                wage: vm.wage,
                wages_total: vm.wagesTotal,
                routes_total: vm.routesTotal,
                other_total: vm.otherTotal,
                all_total: vm.allTotal,
                report: vm.report
            };
            for (var i = 0; i < vm.numOfRoutes; i++) {
                data['routes_from_' + i] = vm['routesFrom' + i];
                data['routes_to_' + i] = vm['routesTo' + i];
                data['routes_transportation_' + i] = vm['routesTransportation' + i];
                data['routes_cost_' + i] = vm['routesCost' + i];
            }
            for (i = 0; i < vm.numOfOther; i++) {
                data['other_description_' + i] = vm['otherDescription' + i];
                data['other_cost_' + i] = vm['otherCost' + i];
            }

            apiService.updateWarrant(warrantId, data, "Putni nalog spremljen!", false);
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
                approverSignature: warrant.approver_signature,
                wage: vm.wage,
                wagesTotal: vm.wagesTotal,
                routesTotal: vm.routesTotal,
                otherTotal: vm.otherTotal,
                allTotal: vm.allTotal,
                report: vm.report
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
