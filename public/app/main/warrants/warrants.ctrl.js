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
        vm.attachments = [];

        vm.formatDate = helperService.formatDate;
        vm.init = init;
        vm.select = select;
        vm.previous = previous;
        vm.next = next;
        vm.getClass = getClass;
        vm.downloadAttachment = downloadAttachment;

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

        function getClass(i) {
            if (vm.warrants[i].invalidity_reason || vm.warrants[i].disapproval_reason || vm.warrants[i].accounting_reason) {
                return 'negative';
            } else if (vm.warrants[i].approved) {
                return 'positive';
            } else return 'pending';
        }

        function setWarrant(i) {
            vm.current = i;
            var data = getWarrantDataObject(vm.warrants[i]);
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('iframe.warrants-frame'));
                    iframe.attr('src', url);
                });

            apiService.getAttachments(data.warrantId).then(function(attachments) {
                vm.attachments = attachments.length == 0 ? null : attachments;
            });
        }

        function getWarrantDataObject(warrant) {
            var data = {
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
                approverStartSignature: warrant.approver_start_signature,
                wage: warrant.wage,
                wagesTotal: warrant.wages_total,
                routesTotal: warrant.routes_total,
                otherTotal: warrant.other_total,
                allTotal: warrant.all_total,
                report: warrant.report,
                applicantSignature: warrant.applicant_signature,
                accountantSignature: warrant.accountant_signature,
                approverSignature: warrant.approver_signature
            };
            for (var i = 0; i < helperService.getNumberOfRoutes(warrant); i++) {
                data['routesFrom' + i] = warrant['routes_from_' + i];
                data['routesTo' + i] = warrant['routes_to_' + i];
                data['routesTransportation' + i] = warrant['routes_transportation_' + i];
                data['routesCost' + i] = warrant['routes_cost_' + i];
            }
            for (i = 0; i < helperService.getNumberOfOther(warrant); i++) {
                data['otherDescription' + i] = warrant['other_description_' + i];
                data['otherCost' + i] = warrant['other_cost_' + i];
            }

            return data;
        }

        function downloadAttachment(name) {
            var iframe = angular.element(document.querySelector('iframe.attachments-frame'));
            iframe.attr('src', 'api/v1/warrants/' + vm.warrants[vm.current].id + '/attachments/' + name);
        }
    }
})();