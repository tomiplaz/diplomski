(function() {
    'use strict';

    angular
        .module('main')
        .controller('InvalidRequestDialogCtrl', InvalidRequestDialogCtrl);

    InvalidRequestDialogCtrl.$inject = ['$mdDialog', 'requestId', 'apiService', 'helperService'];
    function InvalidRequestDialogCtrl($mdDialog, requestId, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = {
                quality_check: false,
                quality_check_timestamp: helperService.formatDate('yyyy-MM-dd HH:mm:ss'),
                invalidity_reason: vm.invalidityReason
            };
            apiService.updateRequest(requestId, data, true);
            hide();
        }
    }
})();