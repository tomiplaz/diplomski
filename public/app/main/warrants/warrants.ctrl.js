(function() {
    'use strict';

    angular
        .module('warrants')
        .controller('WarrantsCtrl', WarrantsCtrl);

    WarrantsCtrl.$inject = ['documentService', 'helperService', 'apiService'];
    function WarrantsCtrl(documentService, helperService, apiService) {
        var vm = this;

        vm.warrants = null;
        vm.current = null;

        vm.formatDate = helperService.formatDate;
        vm.init = init;
        vm.select = select;
        vm.previous = previous;
        vm.next = next;

        function init() {
            if (vm.warrants.length > 0) {
                vm.current = 0;
                setWarrant(0);
            }
        }

        function select(index) {
            vm.current = index;
            setWarrant(index);
        }

        function previous() {
            setWarrant(--vm.current);
        }

        function next() {
            setWarrant(++vm.current);
        }

        function setWarrant(i) {
            vm.current = i;
            getWarrantDataObject(vm.warrants[i]).then(function(data) {
                var doc = documentService.getDocument(data);

                pdfMake
                    .createPdf(doc)
                    .getDataUrl(function(url) {
                        var iframe = angular.element(document.querySelector('iframe'));
                        iframe.attr('src', url);
                    });
            });
        }

        function getWarrantDataObject(warrant) {
            return apiService.getAttachments(warrant.id).then(function(attachments) {
                return {
                    warrantId: warrant.id,
                    mark: warrant.mark,
                    type: warrant.type,
                    documentDate: helperService.formatDate(warrant.document_date, 'dd.MM.yyyy.'),
                    name: warrant.name,
                    surname: warrant.surname,
                    workplace: warrant.workplace,
                    startDate: helperService.formatDate(warrant.start_timestamp, 'dd.MM.yyyy.'),
                    forPlace: warrant.for_place,
                    description: warrant.description,
                    startTimestamp: helperService.formatDate(warrant.start_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                    endTimestamp: helperService.formatDate(warrant.end_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                    durationDays: helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp),
                    transportation: warrant.transportation,
                    expensesResponsible: warrant.expenses_responsible,
                    advancePayment: warrant.advance_payment,
                    approverSignature: warrant.approver_signature,
                    wage: warrant.wage,
                    wagesTotal: warrant.wages_total,
                    routesTotal: warrant.routes_total,
                    otherTotal: warrant.other_total,
                    allTotal: warrant.all_total,
                    report: warrant.report,
                    attachments: attachments
                };
            });
        }
    }
})();