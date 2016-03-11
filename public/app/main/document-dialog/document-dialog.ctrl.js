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

        (function() {
            var doc = { content: "Sveučilište J.J. Strossmayera u Osijeku" };
            pdfMake.createPdf(doc).getDataUrl(function(url) {
                var iframe = angular.element(document.querySelector('.document-dialog iframe'));
                iframe.attr('src', url);
            });
        })();
    }
})();