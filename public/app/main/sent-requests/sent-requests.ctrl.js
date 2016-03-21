(function() {
    'use strict';

    angular
        .module('main')
        .controller('SentRequestsCtrl', SentRequestsCtrl);

    SentRequestsCtrl.$inject = ['requests', '$document', 'documentService', 'helperService', 'dialogService', '$mdDialog'];
    function SentRequestsCtrl(requests, $document, documentService, helperService, dialogService, $mdDialog) {
        var vm = this;

        vm.requests = requests;
        vm.current = null;

        vm.previous = previous;
        vm.next = next;

        vm.showDetails = showDetails;

        $document.ready(function() {
            if (vm.requests.length > 0) {
                vm.current = 0;
                setRequest(0);
            }
        });

        function previous() {
            setRequest(--vm.current);
        }

        function next() {
            setRequest(++vm.current);
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

            vm.icon = getIcon(i);
            vm.class = getClass(i);
        }

        function getRequestDataObject(request) {
            return {
                type: request.type,
                documentDate: helperService.formatDate(request.document_date, 'dd.MM.yyyy.'),
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
                applicantSignature: request.applicant_signature,
                approverSignature: request.approver_signature
            }
        }

        function getIcon(i) {
            if (vm.requests[i].invalidity_reason || vm.requests[i].disapproval_reason) {
                return 'thumb_down';
            } else if (vm.requests[i].approved) {
                return 'thumb_up';
            } else return 'thumbs_up_down';
        }

        function getClass(i) {
            if (vm.requests[i].invalidity_reason || vm.requests[i].disapproval_reason) {
                return 'negative';
            } else if (vm.requests[i].approved) {
                return 'positive';
            } else return 'pending';
        }

        function showDetails($event) {
            var detailsDialogObject = dialogService.getDetailsDialogObject($event, requests[vm.current]);
            $mdDialog.show(detailsDialogObject);
        }
    }
})();