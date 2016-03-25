(function() {
    'use strict';

    angular
        .module('main')
        .controller('MarkRequestDialogCtrl', MarkRequestDialogCtrl);

    MarkRequestDialogCtrl.$inject = ['$mdDialog', 'requestId', 'apiService', 'helperService'];
    function MarkRequestDialogCtrl($mdDialog, requestId, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = {
                mark: vm.mark,
                quality_check: true,
                quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
            };
            apiService.updateRequest(requestId, data, "Zahtjev uspješno prosljeđen!", true);
            hide();
        }
    }
})();