(function() {
    'use strict';

    angular
        .module('app')
        .factory('apiService', apiService);

    apiService.$inject = ['Restangular', '$state', 'toastService', 'helperService', 'Upload'];
    function apiService(Restangular, $state, toastService, helperService, Upload) {
        return {
            getUser: getUser,
            createUser: createUser,
            getRequests: getRequests,
            createRequest: createRequest,
            updateRequest: updateRequest,
            getWarrants: getWarrants,
            updateWarrant: updateWarrant,
            postAttachments: postAttachments,
            deleteAttachments: deleteAttachments,
            getAttachments: getAttachments
        };

        function getUser() {
            return Restangular.all('users').doGET('').then(function(res) {
                return res.user;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja korisnikovih podataka!", 3000);
                $state.go('login');
            });
        }

        function createUser(newUser) {
            return Restangular.all('users').post(newUser).then(function() {
                toastService.show("Korisnik stvoren!");
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
                toastService.show("Zahtjev stvoren!");
                $state.go('main.requests.sent');
            }, function() {
                toastService.show("Greška tijekom stvaranja zahtjeva!", 3000);
            });
        }

        function updateRequest(requestId, data, message, refresh) {
            Restangular.one('requests', requestId).doPUT(data).then(function(request) {
                if (request.approved) {
                    var newWarrant = {
                        user_id: request.user_id,
                        mark: request.mark,
                        type: request.type,
                        document_date: helperService.formatDate(null, 'yyyy-MM-dd'),
                        name: request.name,
                        surname: request.surname,
                        workplace: request.workplace,
                        for_place: request.for_place,
                        start_timestamp: request.start_timestamp,
                        end_timestamp: request.end_timestamp,
                        duration: request.duration,
                        advance_payment: request.advance_payment,
                        description: request.description,
                        transportation: request.transportation,
                        expenses_responsible: request.expenses_responsible,
                        approver_start_signature: request.approver_signature
                    };
                    Restangular.all('warrants').post(newWarrant).then(function() {
                        toastService.show("Putni nalog stvoren i poslan podnositelju zahtjeva!", 3000);
                        if (refresh) $state.go($state.current, {}, { reload: true });
                    }, function() {
                        toastService.show("Greška tijekom stvaranja putnog naloga!", 3000);
                    });
                } else {
                    toastService.show(message);
                    if (refresh) $state.go($state.current, {}, { reload: true });
                }
            }, function() {
                toastService.show("Greška tijekom ažuriranja zahtjeva!", 3000);
            });
        }

        function getWarrants(type) {
            var path = !type ? 'warrants' : 'warrants/' + type;
            return Restangular.all(path).getList().then(function(res) {
                return res;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja putnih naloga!", 3000);
                return [];
            });
        }

        function updateWarrant(warrantId, data, message, refresh) {
            Restangular.one('warrants', warrantId).doPUT(data).then(function() {
                toastService.show(message);
                if (refresh) $state.go($state.current, {}, { reload: true });
            }, function() {
                toastService.show("Greška tijekom ažuriranja putnog naloga!", 3000);
            });
        }

        function postAttachments(warrantId, files) {
            Upload.upload({
                url: 'api/v1/warrants/' + warrantId + '/attachments',
                data: files
            }).then(null, function() {
                toastService.show("Greška tijekom spremanja datoteka!", 3000);
            });
        }

        function deleteAttachments(warrantId) {
            Restangular.one('warrants', warrantId).all('attachments').remove().then(null, function() {
                toastService.show("Greška tijekom ažuriranja datoteka!", 3000);
            });
        }

        function getAttachments(warrantId) {
            return Restangular.one('warrants', warrantId).all('attachments').getList().then(function(res) {
                return res;
            }, function() {
                toastService.show("Greška tijekom dohvaćanja priloga!", 3000);
                return null;
            });
        }
    }
})();