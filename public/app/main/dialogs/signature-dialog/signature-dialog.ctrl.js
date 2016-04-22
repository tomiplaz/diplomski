(function() {
    'use strict';

    angular
        .module('main')
        .controller('SignatureDialogCtrl', SignatureDialogCtrl);

    SignatureDialogCtrl.$inject = ['$scope', '$mdDialog', '$document', 'docType', 'docId', 'userType', 'helperService', 'apiService'];
    function SignatureDialogCtrl($scope, $mdDialog, $document, docType, docId, userType, helperService, apiService) {
        var vm = this;
        var signaturePad = null;
        var confirmButton = null;

        vm.hide = hide;
        vm.clear = clear;
        vm.confirm = confirm;

        $document.ready(function() {
            var canvas = document.querySelector('canvas');
            signaturePad = new SignaturePad(canvas, {
                minWidth: 0.4,
                maxWidth: 1.0,
                onEnd: onEnd
            });

            confirmButton = angular.element(document.querySelector('button[ng-click="signatureDialog.confirm()"]'));
            confirmButton.attr('disabled', 'true');
        });

        function hide() {
            $mdDialog.hide();
        }

        function clear() {
            signaturePad.clear();
            confirmButton.attr('disabled', 'true');
        }

        function confirm() {
            var data = null;
            switch (userType) {
                case 0:
                    if (docType == 'r') {
                        $scope['newRequest']['applicantSignature'] = signaturePad.toDataURL();
                    } else {
                        $scope['pendingWarrants']['applicantSignature'] = signaturePad.toDataURL();
                    }
                    break;
                case 2:
                    data = {
                        approved: true,
                        approved_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        approver_signature: signaturePad.toDataURL()
                    };

                    if (docType == 'r') apiService.updateRequest(docId, data, null, true);
                    else apiService.updateWarrant(docId, data, "Putni nalog odobren!", true);

                    break;
                case 3:
                    data = {
                        accounting_check: true,
                        accounting_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        accountant_signature: signaturePad.toDataURL()
                    };

                    apiService.updateWarrant(docId, data, "Putni nalog odobren!", true);

                    break;
                default:
                    break;
            }
            hide();
        }

        function onEnd() {
            if (!signaturePad.isEmpty()) {
                confirmButton.removeAttr('disabled');
            }
        }
    }
})();