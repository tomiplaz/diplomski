(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsSentCtrl', RequestsSentCtrl);

    RequestsSentCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsSentCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 0) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema poslanih zahtjeva.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.icon = getIcon($scope['requests'].current);
        vm.class = getClass($scope['requests'].current);
        vm.showDetails = showDetails;

        $scope.$watch('requests.current', function() {
            vm.icon = getIcon($scope['requests'].current);
            vm.class = getClass($scope['requests'].current);
            vm.classAria = getClassAria();
        });

        function showDetails($event) {
            var detailsDialogObject = dialogService.getDetailsDialogObject($event, requests[$scope['requests'].current]);
            $mdDialog.show(detailsDialogObject);
        }

        function getIcon(i) {
            if ($scope['requests'].requests[i].invalidity_reason || $scope['requests'].requests[i].disapproval_reason) {
                return 'thumb_down';
            } else if ($scope['requests'].requests[i].approved) {
                return 'thumb_up';
            } else return 'thumbs_up_down';
        }

        function getClass(i) {
            if ($scope['requests'].requests[i].invalidity_reason || $scope['requests'].requests[i].disapproval_reason) {
                return 'negative';
            } else if ($scope['requests'].requests[i].approved) {
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