(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', 'helperService', 'apiService', '$state'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, helperService, apiService, $state) {
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
                user_id: data.userId,
                type: data.type,
                document_date: helperService.formatDate(null, 'yyyy-MM-dd'),
                name: data.name,
                surname: data.surname,
                workplace: data.workplace,
                for_place: data.forPlace,
                for_faculty: data.type != 'n' ? null : data.forFaculty,
                for_subject: data.type != 'n' ? null : data.forSubject,
                project_leader: data.type == 'n' ? null : data.projectLeader,
                start_timestamp: helperService.formatDate(data.startTimestampRaw, 'yyyy-MM-dd HH:mm:ss'),
                end_timestamp: helperService.formatDate(data.endTimestampRaw, 'yyyy-MM-dd HH:mm:ss'),
                duration: data.duration,
                advance_payment: data.advancePayment,
                description: data.description,
                transportation: data.transportation,
                expenses_responsible: data.expensesResponsible,
                expenses_explanation: data.expensesExplanation,
                applicant_signature: data.applicantSignature
            };

            apiService.createRequest(newRequest);
            hide();
        }
    }
})();