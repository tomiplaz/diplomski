(function() {
    'use strict';

    angular
        .module('main')
        .controller('RejectRequestDialogCtrl', RejectRequestDialogCtrl);

    RejectRequestDialogCtrl.$inject = ['$mdDialog', 'requestId', 'type', 'apiService', 'helperService'];
    function RejectRequestDialogCtrl($mdDialog, requestId, type, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        switch (type) {
            case 1:
                vm.title = "Neispravnost zahtjeva";
                vm.label = "Razlog neispravnosti";
                break;
            case 2:
                vm.title = "Odbijanje zahtjeva";
                vm.label = "Razlog odbijanja";
                break;
            default:
                vm.title = "Naslov";
                vm.label = "Labela";
                break;
        }

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = getDataObject();
            if (data != null) apiService.updateRequest(requestId, data, "Zahtjev odbijen!", true);
            hide();
        }

        function getDataObject() {
            switch (type) {
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
                default:
                    return null;
            }
        }
    }
})();