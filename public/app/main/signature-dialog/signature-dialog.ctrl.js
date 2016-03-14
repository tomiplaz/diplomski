(function() {
    'use strict';

    angular
        .module('main')
        .controller('SignatureDialogCtrl', SignatureDialogCtrl);

    SignatureDialogCtrl.$inject = ['$mdDialog', '$document'];
    function SignatureDialogCtrl($mdDialog, $document) {
        var vm = this;

        vm.hide = hide;

        function hide() {
            $mdDialog.hide();
        }

        $document.ready(function() {
            var canvas = document.querySelector('canvas');
            var signaturePad = new SignaturePad(canvas);
        });
    }
})();