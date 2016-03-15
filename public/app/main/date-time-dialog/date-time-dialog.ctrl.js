(function() {
    'use strict';

    angular
        .module('main')
        .controller('DateTimeDialogCtrl', DateTimeDialogCtrl);

    DateTimeDialogCtrl.$inject = ['$scope', '$mdDialog', 'data', '$filter'];
    function DateTimeDialogCtrl($scope, $mdDialog, data, $filter) {
        var vm = this;

        vm.label = data.label;
        vm.mindate = data.mindate;
        vm.maxdate = data.maxdate;

        vm.hide = hide;
        vm.cancel = cancel;
        vm.save = save;

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            $scope['newRequest'][data.property] = null;
            hide();
        }

        function save($value) {
            $scope['newRequest'][data.property + 'Raw'] = $value;

            if (data.property == 'endTimestamp') {
                if ($scope['newRequest']['startTimestamp'] != undefined && new Date($value) > new Date($scope['newRequest']['startTimestampRaw'])) {
                    $scope['newRequest'][data.property] = $filter('date')(new Date($value), 'dd.MM.yyyy., HH:mm');
                }
            } else {
                $scope['newRequest'][data.property] = $filter('date')(new Date($value), 'dd.MM.yyyy., HH:mm');
            }

            hide();
        }
    }
})();