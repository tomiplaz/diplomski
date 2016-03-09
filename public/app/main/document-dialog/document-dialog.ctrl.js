(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog'];
    function DocumentDialogCtrl($mdDialog) {
        var vm = this;

        vm.hide = hide;

        function hide() {
            $mdDialog.hide();
        }
    }
})();