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

        vm.cancel = cancel;
        vm.save = save;
        vm.hide = hide;

        function cancel() {
            $scope[data.ctrl][data.property] = null;

            $mdDialog.hide();
        }

        function save($value) {
            $scope[data.ctrl][data.property + 'Raw'] = $value;
            $scope[data.ctrl][data.property] = $filter('date')(new Date($value), 'dd.MM.yyyy., HH:mm');

            $mdDialog.hide();
        }

        function hide() {
            $mdDialog.hide();
        }
    }
})();