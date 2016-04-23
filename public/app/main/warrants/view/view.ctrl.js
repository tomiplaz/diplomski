(function() {
    'use strict';

    angular
        .module('warrants')
        .controller('WarrantsViewCtrl', WarrantsViewCtrl);

    WarrantsViewCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog'];
    function WarrantsViewCtrl($scope, $state, warrants, dialogService, $mdDialog) {
        if (!_.includes([0, 1, 2, 3], $scope['main'].user.type)) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema poslanih zahtjeva.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.icon = getIcon($scope['warrants'].current);
        vm.class = getClass($scope['warrants'].current);
        vm.showDetails = showDetails;

        $scope.$watch('warrants.current', function() {
            vm.icon = getIcon($scope['warrants'].current);
            vm.class = getClass($scope['warrants'].current);
            vm.classAria = getClassAria();
        });

        function showDetails($event) {
            var detailsDialogObject = dialogService.getDetailsDialogObject($event, warrants[$scope['warrants'].current]);
            $mdDialog.show(detailsDialogObject);
        }

        function getIcon(i) {
            var warrant = $scope['warrants'].warrants[i];
            if (warrant.invalidity_reason || warrant.accounting_reason || warrant.disapproval_reason) {
                return 'thumb_down';
            } else if (warrant.approved) {
                return 'thumb_up';
            } else return 'thumbs_up_down';
        }

        function getClass(i) {
            var warrant = $scope['warrants'].warrants[i];
            if (warrant.invalidity_reason || warrant.accounting_reason || warrant.disapproval_reason) {
                return 'negative';
            } else if (warrant.approved) {
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