(function() {
    'use strict';

    angular
        .module('main')
        .controller('InvalidRequestDialogCtrl', InvalidRequestDialogCtrl);

    InvalidRequestDialogCtrl.$inject = ['$mdDialog', 'requestId'];
    function InvalidRequestDialogCtrl($mdDialog, requestId) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            //
            hide();
        }
    }
})();