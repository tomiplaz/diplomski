(function() {
    'use strict';

    angular
        .module('app')
        .factory('dialogService', dialogService);

    function dialogService() {
        return {
            getDateTimeDialogObject: getDateTimeDialogObject,
            getDocumentDialogObject: getDocumentDialogObject,
            getSignatureDialogObject: getSignatureDialogObject,
            getRejectRequestDialogObject: getRejectRequestDialogObject,
            getDetailsDialogObject: getDetailsDialogObject,
            getMarkRequestDialogObject: getMarkRequestDialogObject
        };

        function getDateTimeDialogObject(scope, event, data) {
            return {
                controller: 'DateTimeDialogCtrl as dateTimeDialog',
                templateUrl: 'app/main/dialogs/date-time-dialog/date-time-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    data: data
                }
            }
        }

        function getDocumentDialogObject(event, data) {
            return {
                controller: 'DocumentDialogCtrl as documentDialog',
                templateUrl: 'app/main/dialogs/document-dialog/document-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    data: data
                }
            }
        }

        function getSignatureDialogObject(scope, event, requestId, type) {
            return {
                controller: 'SignatureDialogCtrl as signatureDialog',
                templateUrl: 'app/main/dialogs/signature-dialog/signature-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    requestId: requestId,
                    type: type
                }
            }
        }

        function getRejectRequestDialogObject(event, requestId, type) {
            return {
                controller: 'RejectRequestDialogCtrl as rejectRequestDialog',
                templateUrl: 'app/main/dialogs/reject-request-dialog/reject-request-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    requestId: requestId,
                    type: type
                }
            }
        }

        function getDetailsDialogObject(event, request) {
            return {
                controller: 'DetailsDialogCtrl as detailsDialog',
                templateUrl: 'app/main/dialogs/details-dialog/details-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    request: request
                }
            }
        }

        function getMarkRequestDialogObject(event, requestId) {
            return {
                controller: 'MarkRequestDialogCtrl as markRequestDialog',
                templateUrl: 'app/main/dialogs/mark-request-dialog/mark-request-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    requestId: requestId
                }
            }
        }
    }
})();