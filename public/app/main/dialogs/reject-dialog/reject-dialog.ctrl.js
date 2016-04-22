(function() {
    'use strict';

    angular
        .module('main')
        .controller('RejectDialogCtrl', RejectDialogCtrl);

    RejectDialogCtrl.$inject = ['$mdDialog', 'docType', 'docId', 'userType', 'warrant', 'apiService', 'helperService'];
    function RejectDialogCtrl($mdDialog, docType, docId, userType, warrant, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        switch (userType) {
            case 1:
                vm.title = "Neispravnost " + (docType == 'r' ? " zahtjeva" : " putnog naloga");
                vm.label = "Razlog neispravnosti";
                break;
            case 2:
                vm.title = "Odbijanje " + (docType == 'r' ? " zahtjeva" : " putnog naloga");
                vm.label = "Razlog odbijanja";
                break;
            case 3:
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

                vm.updateWagesTotal = updateWagesTotal;
                vm.addRoute = addRoute;
                vm.removeRoute = removeRoute;
                vm.updateRoutesTotal = updateRoutesTotal;
                vm.addOther = addOther;
                vm.removeOther = removeOther;
                vm.updateOtherTotal = updateOtherTotal;

                break;
            default:
                break;
        }

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = getDataObject();
            if (data != null) {
                if (docType == 'r') apiService.updateRequest(docId, data, "Zahtjev odbijen!", true);
                else apiService.updateWarrant(docId, data, "Putni nalog odbijen!", true);
            }
            hide();
        }

        function getDataObject() {
            switch (userType) {
                case 1:
                    return {
                        quality_check: false,
                        quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        invalidity_reason: vm.reason
                    };
                case 2:
                    return {
                        approved: false,
                        approved_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        disapproval_reason: vm.reason
                    };
                case 3:
                    var data = {
                        wage: vm.wage,
                        wages_total: vm.wagesTotal,
                        routes_total: vm.routesTotal,
                        other_total: vm.otherTotal,
                        all_total: vm.allTotal,

                        accounting_check: false,
                        accounting_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        accounting_reason: vm.reason
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

                    return data;
                default:
                    return null;
            }
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
    }
})();