(function() {
    'use strict';

    angular
        .module('app')
        .factory('apiService', apiService);

    apiService.$inject = ['Restangular', '$state', 'toastService'];
    function apiService(Restangular, $state, toastService) {
        return {
            getUser: getUser,
            getRequests: getRequests,
            postRequest: postRequest
        };

        function getUser() {
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja korisnikovih podataka!", 3000);
                $state.go('login');
            });
        }

        function getRequests() {
            return Restangular.all('requests').getList().then(function(res) {
                return res;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja zahtjeva!", 3000);
            });
        }

        function postRequest(newRequest) {
            Restangular.all('requests').post(newRequest).then(function() {
                toastService.show("Dokument spremljen!");
                $state.go('main.sent-requests');
            }, function() {
                toastService.show("Greška tijekom spremanja dokumenta!", 3000);
            });
        }
    }
})();