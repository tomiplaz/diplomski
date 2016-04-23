(function() {
    'use strict';

    angular
        .module('main')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['user', '$state', '$auth'];
    function MainCtrl(user, $state, $auth) {
        var vm = this;

        vm.user = user;
        vm.logout = logout;
        vm.goToState = goToState;

        vm.allStates = [
            {
                name: 'main.home',
                label: 'Početna',
                icon: 'home',
                type: [0, 1, 2, 3, 4]
            },
            {
                name: 'main.new-request',
                label: 'Novi zahtjev',
                character: 'Z',
                icon: 'library_add',
                type: [0]
            },
            {
                name: 'main.requests.validation',
                label: 'Validacija zahtjeva',
                character: 'Z',
                icon: 'assessment',
                type: [1]
            },
            {
                name: 'main.requests.approval',
                label: 'Odobravanje zahtjeva',
                character: 'Z',
                icon: 'assessment',
                type: [2]
            },
            {
                name: 'main.requests.sent',
                label: 'Poslani zahtjevi',
                character: 'Z',
                icon: 'library_books',
                type: [0]
            },
            {
                name: 'main.requests.processed',
                label: 'Obrađeni zahtjevi',
                character: 'Z',
                icon: 'library_books',
                type: [1, 2]
            },
            {
                name: 'main.new-user',
                label: 'Novi korisnik',
                icon: 'details',
                type: [4]
            },
            {
                name: 'main.pending-warrants',
                label: 'Tekući putni nalozi',
                character: 'N',
                icon: 'library_add',
                type: [0]
            },
            {
                name: 'main.warrants.validation',
                label: 'Validacija putnih naloga',
                character: 'N',
                icon: 'assessment',
                type: [1]
            },
            {
                name: 'main.warrants.accounting',
                label: 'Računovođenje putnih naloga',
                character: 'N',
                icon: 'assessment',
                type: [3]
            },
            {
                name: 'main.warrants.approval',
                label: 'Odobravanje putnih naloga',
                character: 'N',
                icon: 'assessment',
                type: [2]
            },
            {
                name: 'main.warrants.sent',
                label: 'Poslani putni nalozi',
                character: 'N',
                icon: 'library_books',
                type: [0]
            },
            {
                name: 'main.warrants.processed',
                label: 'Obrađeni putni nalozi',
                character: 'N',
                icon: 'library_books',
                type: [1, 2, 3]
            }
        ];

        vm.userStates = _.filter(vm.allStates, function(state) {
            return _.includes(state.type, user.type);
        });

        function logout() {
            $auth.logout().then(function() {
                $state.go('login');
            });
        }

        function goToState(state) {
            $state.go(state);
        }
    }
})();
