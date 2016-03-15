(function() {
    'use strict'

    angular
        .module('app')
        .factory('toastService', toastService);

    toastService.$inject = ['$mdToast'];
    function toastService($mdToast) {
        return {
            show: show
        };

        function show(text, duration) {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent(text)
                    .position('bottom right')
                    .capsule(true)
                    .hideDelay(duration == undefined ? 2000 : duration)
            );
        }
    }
})();