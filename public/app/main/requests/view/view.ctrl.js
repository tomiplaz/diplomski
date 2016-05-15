(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsViewCtrl', RequestsViewCtrl);

    RequestsViewCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsViewCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if (!_.includes([0, 1, 2], $scope['main'].user.type)) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema poslanih zahtjeva.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.icon = requests.length != 0 ? getIcon($scope['requests'].current) : null;
        vm.class = requests.length != 0 ? getClass($scope['requests'].current) : null;
        vm.showDetails = showDetails;

        $scope.$watch('requests.current', function() {
            if (requests.length != 0) {
                vm.icon = getIcon($scope['requests'].current);
                vm.class = getClass($scope['requests'].current);
                vm.classAria = getClassAria();
            }
        });

        function showDetails($event) {
            var detailsDialogObject = dialogService.getDetailsDialogObject($event, requests[$scope['requests'].current]);
            $mdDialog.show(detailsDialogObject);
        }

        function getIcon(i) {
            var request = $scope['requests'].requests[i];
            if (request.invalidity_reason || request.disapproval_reason) {
                return 'thumb_down';
            } else if (request.approved) {
                return 'thumb_up';
            } else return 'thumbs_up_down';
        }

        function getClass(i) {
            var request = $scope['requests'].requests[i];
            if (request.invalidity_reason || request.disapproval_reason) {
                return 'negative';
            } else if (request.approved) {
                return 'positive';
            } else return 'pending';
        }

        function getClassAria() {
            if (vm.class == 'negative') {
                return 'Odbijen';
            } else if (vm.class == 'positive') {
                return 'Odobren';
            } else return 'U tijeku'
        }
    }
})();