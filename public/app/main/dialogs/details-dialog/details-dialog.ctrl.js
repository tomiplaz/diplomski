(function() {
    'use strict';

    angular
        .module('main')
        .controller('DetailsDialogCtrl', DetailsDialogCtrl);

    DetailsDialogCtrl.$inject = ['doc', '$mdDialog', 'helperService'];
    function DetailsDialogCtrl(doc, $mdDialog, helperService) {
        var vm = this;

        vm.hide = hide;

        vm.getCreationInfo = getCreationInfo;
        vm.getMainInfo = getMainInfo;
        vm.getReason = getReason;

        function hide() {
            $mdDialog.hide();
        }

        function getCreationInfo() {
            if (!doc.report) {
                return "Zahtjev je poslan " + helperService.formatDate(doc.created_at, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else {
                return "Putni nalog je poslan " + helperService.formatDate(doc.sent, "dd.MM.yyyy. 'u' HH:mm") + ".";
            }
        }

        function getMainInfo() {
            var docType = (!doc.report ? "Zahtjev" : "Putni nalog");
            if (doc.quality_check == null) {
                return "Provjera ispravnosti još nije izvršena."
            } else if (doc.quality_check == false) {
                return docType + " je ocijenjen neispravnim " + helperService.formatDate(doc.quality_check_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (doc.approved) {
                return docType + " je odobren " + helperService.formatDate(doc.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (doc.accounting_check == false || doc.approved == false) {
                return docType + " je odbijen " + helperService.formatDate(doc.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else {
                return docType + " je ispravan i čeka odobrenje.";
            }
        }

        function getReason() {
            if (doc.invalidity_reason != null) {
                return doc.invalidity_reason;
            } else if (doc.accounting_reason != null) {
                return doc.accounting_reason;
            } else if (doc.disapproval_reason != null) {
                return doc.disapproval_reason;
            } else {
                return null;
            }
        }
    }
})();