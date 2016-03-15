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
                icon: 'app/icons/ic_home_black_24px.svg',
                type: [0, 1, 2, 3]
            },
            {
                name: 'main.new-request',
                label: 'Novi zahtjev',
                icon: 'app/icons/ic_library_add_black_24px.svg',
                type: [0]
            },
            {
                name: 'main.sent-requests',
                label: 'Poslani zahtjevi',
                icon: 'app/icons/ic_library_books_black_24px.svg',
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
