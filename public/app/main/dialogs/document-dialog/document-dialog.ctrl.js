(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', 'helperService', 'apiService', '$scope', 'toastService'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, helperService, apiService, $scope, toastService) {
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
            if (!data.report) {
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
            } else {
                var warrant = {
                    wage: data.wage,
                    wages_total: data.wagesTotal,
                    routes_total: data.routesTotal,
                    other_total: data.otherTotal,
                    all_total: data.allTotal,
                    report: data.report,
                    applicant_signature: data.applicantSignature,
                    sent: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
                };
                for (var i = 0; i < 7; i++) {
                    warrant['routes_from_' + i] = !data['routesFrom' + i] ? null : data['routesFrom' + i];
                    warrant['routes_to_' + i] = !data['routesTo' + i] ? null : data['routesTo' + i];
                    warrant['routes_transportation_' + i] = !data['routesTransportation' + i] ? null : data['routesTransportation' + i];
                    warrant['routes_cost_' + i] = !data['routesCost' + i] ? null : data['routesCost' + i];
                }
                for (i = 0; i < 4; i++) {
                    warrant['other_description_' + i] = !data['otherDescription' + i] ? null : data['otherDescription' + i];
                    warrant['other_cost_' + i] = !data['otherCost' + i] ? null : data['otherCost' + i];
                }

                if (data.attachments) {
                    if (!helperService.areFilesExtensionsValid(data.attachments)) {
                        $scope['pendingWarrants'].attachments = null;
                        toastService.show("Odabrani neprihvatljivi tipovi datoteka! Prihvatljivi tipovi datoteka su .pdf, .png, .jpg, .jpeg.", 6000);
                    } else if (!helperService.isFilesArrayUnderMaxSize(data.attachments)) {
                        $scope['pendingWarrants'].attachments = null;
                        toastService.show("Odabrane datoteke zauzimaju previše memorije! Skup odabranih datoteka mora zauzimati manje od 10 MB.", 6000);
                    } else {
                        apiService.postAttachments(data.warrantId, data.attachments);
                        apiService.updateWarrant(data.warrantId, warrant, "Putni zahtjev poslan!", true);

                    }
                } else {
                    apiService.deleteAttachments(data.warrantId);
                    apiService.updateWarrant(data.warrantId, warrant, "Putni zahtjev poslan!", true);
                }
            }

            hide();
        }
    }
})();