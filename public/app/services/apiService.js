(function() {
    'use strict';

    angular
        .module('app')
        .factory('apiService', apiService);

    apiService.$inject = ['Restangular', '$state', 'toastService'];
    function apiService(Restangular, $state, toastService) {
        return {
            getUser: getUser,
            createUser: createUser,
            getRequests: getRequests,
            createRequest: createRequest,
            updateRequest: updateRequest
        };

        function getUser() {
            return Restangular.all('user').doGET('').then(function(res) {
                return res.user;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja korisnikovih podataka!", 3000);
                $state.go('login');
            });
        }

        function createUser(newUser) {
            return Restangular.all('user').post(newUser).then(function() {
                toastService.show("Korisnik spremljen!");
                $state.go('main.home');
            }, function() {
                toastService.show("Greška tijekom spremanja korisnika!", 3000);
            });
        }

        function getRequests(type) {
            var path = !type ? 'requests' : 'requests/' + type;
            return Restangular.all(path).getList().then(function(res) {
                return res;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja zahtjeva!", 3000);
                return [];
            });
        }

        function createRequest(newRequest) {
            Restangular.all('requests').post(newRequest).then(function() {
                toastService.show("Dokument spremljen!");
                $state.go('main.sent');
            }, function() {
                toastService.show("Greška tijekom spremanja dokumenta!", 3000);
            });
        }

        function updateRequest(requestId, data, message, refresh) {
            Restangular.one('requests', requestId).doPUT(data).then(function() {
                toastService.show(message);
                if (refresh) $state.go($state.current, {}, { reload: true });
            }, function() {
                toastService.show("Greška tijekom ažuriranja zahtjeva!", 3000);
            })
        }
    }
})();