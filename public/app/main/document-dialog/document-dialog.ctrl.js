(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', '$filter', 'Restangular', 'toastService'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, $filter, Restangular, toastService) {
        var vm = this;

        vm.hide = hide;
        vm.send = send;

        $document.ready(function() {
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('.document-dialog iframe'));
                    iframe.attr('src', url);
                });
        });

        function hide() {
            $mdDialog.hide();
        }

        function send() {
            var newRequestN = {
                document_date: $filter('date')(new Date(), 'yyyy-MM-dd'),
                name: data.name,
                surname: data.surname,
                workplace: data.workplace,
                for_place: data.forPlace,
                for_faculty: data.forFaculty,
                for_subject: data.forSubject,
                start_timestamp: $filter('date')(new Date(data.startTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                end_timestamp: $filter('date')(new Date(data.endTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                purpose: data.purpose,
                transportation: data.transportation,
                expenses_responsible: data.expensesResponsible,
                expenses_explanation: data.expensesExplanation,
                applicant_signature: data.applicantSignature
            };

            Restangular.all('request-ns').post(newRequestN).then(function() {
                hide();
                toastService.show("Dokument spremljen!");
            }, function() {
                hide();
                toastService.show("Greška tijekom spremanja dokumenta!", 3000);
            });
        }
    }
})();