(function() {
    'use strict'

    angular
        .module('app')
        .factory('dialogService', dialogService);

    function dialogService() {
        return {
            getDialogObject: getDialogObject
        };

        function getDialogObject(scope, event, label, ctrl, property) {
            return {
                controller: 'DateTimeDialogCtrl as dateTimeDialog',
                templateUrl: 'app/main/main.date-time-dialog.html',
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
                        property: property
                    }
                }
            }
        }
    }
})();