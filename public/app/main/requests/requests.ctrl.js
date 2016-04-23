(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsCtrl', RequestsCtrl);

    RequestsCtrl.$inject = ['documentService', 'helperService'];
    function RequestsCtrl(documentService, helperService) {
        var vm = this;

        vm.requests = null;
        vm.current = null;

        vm.formatDate = helperService.formatDate;
        vm.init = init;
        vm.select = select;
        vm.previous = previous;
        vm.next = next;
        vm.getClass = getClass;

        function init() {
            if (vm.requests.length > 0) {
                vm.current = 0;
                setRequest(0);
            }
        }

        function select(index) {
            vm.current = index;
            setRequest(index);
        }

        function previous() {
            setRequest(--vm.current);
        }

        function next() {
            setRequest(++vm.current);
        }

        function getClass(i) {
            if (vm.requests[i].invalidity_reason || vm.requests[i].disapproval_reason) {
                return 'negative';
            } else if (vm.requests[i].approved) {
                return 'positive';
            } else return 'pending';
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
                documentDate: helperService.formatDate(request.document_date, 'dd.MM.yyyy.'),
                name: request.name,
                surname: request.surname,
                workplace: request.workplace,
                forPlace: request.for_place,
                forFaculty: request.for_faculty,
                forSubject: request.for_subject,
                projectLeader: request.project_leader,
                startTimestamp: helperService.formatDate(request.start_timestamp, 'dd.MM.yyyy. HH:mm'),
                endTimestamp: helperService.formatDate(request.end_timestamp, 'dd.MM.yyyy. HH:mm'),
                duration: request.duration,
                advancePayment: request.advance_payment,
                description: request.description,
                transportation: request.transportation,
                expensesResponsible: request.expenses_responsible,
                expensesExplanation: request.expenses_explanation,
                applicantSignature: request.applicant_signature,
                approverSignature: request.approver_signature
            }
        }
    }
})();