(function() {
    'use strict'

    angular
        .module('app')
        .factory('dialogService', dialogService);

    function dialogService() {
        return {
            getDateTimeDialogObject: getDateTimeDialogObject,
            getDocumentDialogObject: getDocumentDialogObject
        };

        function getDateTimeDialogObject(scope, event, label, ctrl, property, mindate, maxdate) {
            return {
                controller: 'DateTimeDialogCtrl as dateTimeDialog',
                templateUrl: 'app/main/date-time-dialog/date-time-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {
                    data: {
                        label: label,
                        ctrl: ctrl,
                        property: property,
                        mindate: mindate,
                        maxdate: maxdate
                    }
                }
            }
        }

        function getDocumentDialogObject(scope, event) {
            return {
                controller: 'DocumentDialogCtrl as documentDialog',
                templateUrl: 'app/main/document-dialog/document-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true
            }
        }
    }
})();