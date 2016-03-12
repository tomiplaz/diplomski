(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', 'data'];
    function DocumentDialogCtrl($mdDialog, documentService, data) {
        var vm = this;

        vm.hide = hide;

        function hide() {
            $mdDialog.hide();
        }

        (function() {
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('.document-dialog iframe'));
                    iframe.attr('src', url);
                });
        })();
    }
})();