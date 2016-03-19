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
            createRequest: createRequest,
            updateRequest: updateRequest
        };

        function getUser() {
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja korisnikovih podataka!", 3000);
                $state.go('login');
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
                $state.go('main.sent-requests');
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