(function() {
    'use strict';

    angular
        .module('main')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['user', '$state', '$auth'];
    function MainCtrl(user, $state, $auth) {
        var vm = this;

        vm.user = user;
        vm.openDial = false;
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
                icon: 'library_add',
                type: [0]
            },
            {
                name: 'main.requests.validate',
                label: 'Validacija zahtjeva',
                icon: 'library_books',
                type: [1]
            },
            {
                name: 'main.requests.approve',
                label: 'Odobravanje zahtjeva',
                icon: 'library_books',
                type: [2]
            },
            {
                name: 'main.requests.sent',
                label: 'Poslani zahtjevi',
                icon: 'library_books',
                type: [0]
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
                icon: 'library_add',
                type: [0]
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
