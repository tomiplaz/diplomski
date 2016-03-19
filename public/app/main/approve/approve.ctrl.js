(function() {
    'use strict';

    angular
        .module('main')
        .controller('ApproveCtrl', ApproveCtrl);

    ApproveCtrl.$inject = ['$scope', 'requests', '$document', 'documentService', 'helperService', 'dialogService', '$mdDialog'];
    function ApproveCtrl($scope, requests, $document, documentService, helperService, dialogService, $mdDialog) {
        var vm = this;

        vm.requests = requests;
        vm.current = null;

        vm.previous = previous;
        vm.next = next;
        vm.disapprove = disapprove;
        vm.approve = approve;

        $document.ready(function() {
            if (vm.requests.length > 0) setRequest(0);
        });

        function previous() {
            setRequest(--vm.current);
        }

        function next() {
            setRequest(++vm.current);
        }

        function disapprove($event) {
            var requestId = vm.requests[vm.current].id;
            var rejectRequestDialogObject = dialogService.getRejectRequestDialogObject($event, requestId, 2);
            $mdDialog.show(rejectRequestDialogObject);
        }

        function approve($event) {
            var requestId = vm.requests[vm.current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, requestId, 2);
            $mdDialog.show(signatureDialogObject);
        }

        function setRequest(i) {
            vm.current = i;
            var data = getRequestDataObject(vm.requests[i]);
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('iframe'));
                    iframe.attr('src', url);
                });
        }

        function getRequestDataObject(request) {
            return {
                type: request.type,
                documentDate: request.document_date,
                name: request.name,
                surname: request.surname,
                workplace: request.workplace,
                forPlace: request.for_place,
                forFaculty: request.for_faculty,
                forSubject: request.for_subject,
                advancePayment: request.advance_payment,
                startTimestamp: helperService.formatDate(request.start_timestamp, 'dd.MM.yyyy. HH:mm'),
                endTimestamp: helperService.formatDate(request.end_timestamp, 'dd.MM.yyyy. HH:mm'),
                duration: request.duration,
                description: request.description,
                transportation: request.transportation,
                expensesResponsible: request.expenses_responsible,
                expensesExplanation: request.expenses_explanation,
                applicantSignature: request.applicant_signature
            }
        }
    }
})();