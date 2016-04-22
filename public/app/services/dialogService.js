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
            getRejectDialogObject: getRejectDialogObject,
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

        function getSignatureDialogObject(scope, event, docType, docId, userType) {
            return {
                controller: 'SignatureDialogCtrl as signatureDialog',
                templateUrl: 'app/main/dialogs/signature-dialog/signature-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    docType: docType,
                    docId: docId,
                    userType: userType
                }
            }
        }

        function getRejectDialogObject(event, docType, docId, userType, warrant) {
            return {
                controller: 'RejectDialogCtrl as rejectDialog',
                templateUrl: 'app/main/dialogs/reject-dialog/reject-dialog-' + (userType != 3 ? 'reason' : 'bill') + '.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    docType: docType,
                    docId: docId,
                    userType: userType,
                    warrant: warrant
                }
            }
        }

        function getDetailsDialogObject(event, doc) {
            return {
                controller: 'DetailsDialogCtrl as detailsDialog',
                templateUrl: 'app/main/dialogs/details-dialog/details-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    doc: doc
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