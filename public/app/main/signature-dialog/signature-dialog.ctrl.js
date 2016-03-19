(function() {
    'use strict';

    angular
        .module('main')
        .controller('SignatureDialogCtrl', SignatureDialogCtrl);

    SignatureDialogCtrl.$inject = ['$scope', '$mdDialog', '$document', 'requestId', 'type', 'helperService', 'apiService'];
    function SignatureDialogCtrl($scope, $mdDialog, $document, requestId, type, helperService, apiService) {
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
            switch (type) {
                case 0:
                    $scope['newRequest']['applicantSignature'] = signaturePad.toDataURL();
                    break;
                case 2:
                    var data = {
                        approved: true,
                        approved_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        approver_signature: signaturePad.toDataURL()
                    };
                    apiService.updateRequest(requestId, data, "Zahtjev uspješno odobren!", true);
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