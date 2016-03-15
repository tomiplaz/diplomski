(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', '$filter', 'Restangular', 'toastService', '$state'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, $filter, Restangular, toastService, $state) {
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
            var newRequest = {
                type: data.type,
                document_date: $filter('date')(new Date(), 'yyyy-MM-dd'),
                name: data.name,
                surname: data.surname,
                workplace: data.workplace,
                for_place: data.forPlace,
                for_faculty: data.type != 'n' ? null : data.forFaculty,
                for_subject: data.type != 'n' ? null : data.forSubject,
                advance_payment: data.type == 'n' ? null : data.advancePayment,
                start_timestamp: $filter('date')(new Date(data.startTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                end_timestamp: $filter('date')(new Date(data.endTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                description: data.description,
                transportation: data.transportation,
                expenses_responsible: data.expensesResponsible,
                expenses_explanation: data.expensesExplanation,
                applicant_signature: data.applicantSignature
            };

            Restangular.all('requests').post(newRequest).then(function() {
                hide();
                toastService.show("Dokument spremljen!");
                $state.go('main.sent-requests');
            }, function() {
                hide();
                toastService.show("Greška tijekom spremanja dokumenta!", 3000);
            });
        }
    }
})();