(function() {
    'use strict';

    angular
        .module('main')
        .controller('DetailsDialogCtrl', DetailsDialogCtrl);

    DetailsDialogCtrl.$inject = ['request', '$mdDialog', 'helperService'];
    function DetailsDialogCtrl(request, $mdDialog, helperService) {
        var vm = this;

        vm.hide = hide;

        vm.getCreationInfo = getCreationInfo;
        vm.getMainInfo = getMainInfo;
        vm.getReason = getReason;

        function hide() {
            $mdDialog.hide();
        }

        function getCreationInfo() {
            return "Zahtjev je poslan " + helperService.formatDate(request.created_at, "dd.MM.yyyy. 'u' HH:mm") + ".";
        }

        function getMainInfo() {
            if (request.quality_check == null) {
                return "Provjera ispravnosti zahtjeva još nije izvršena."
            } else if (request.quality_check == false) {
                return "Zahtjev je ocijenjen neispravnim " + helperService.formatDate(request.quality_check_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (request.approved) {
                return "Zahtjev je odobren " + helperService.formatDate(request.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (request.approved == false) {
                return "Zahtjev je odbijen " + helperService.formatDate(request.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else {
                return "Zahtjev je ispravan i čeka odobrenje.";
            }
        }

        function getReason() {
            if (request.invalidity_reason != null) {
                return request.invalidity_reason;
            } else if (request.disapproval_reason != null) {
                return request.disapproval_reason;
            } else {
                return null;
            }
        }
    }
})();