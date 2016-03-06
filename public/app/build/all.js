(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer', 'login', 'main'
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);

    function configure($urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('indigo')
            .warnPalette('amber')
            .backgroundPalette('grey');

        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');
    }
})();
(function() {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['Restangular', '$state'];
    function userService(Restangular, $state) {
        return {
            getUser: getUser
        };

        function getUser() {
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
            }, function(error) {
                // show error message maybe
                $state.go('login');
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('login', []);
})();
(function() {
    'use strict';

    angular
        .module('login')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginCtrl as login'
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$auth', '$state'];
    function LoginCtrl($auth, $state) {
        var vm = this;
        vm.login = login;
        vm.user = null;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                $state.go('main.home');
            }, function(error) {
                // show error message
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main', []);
})();

(function() {
    'use strict';

    angular
        .module('main')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main', {
                abastract: true,
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl as main',
                resolve: {
                    user: function(userService) {
                        return userService.getUser();
                    }
                }
            })
            .state('main.home', {
                url: '/home',
                templateUrl: 'app/main/main.home.html'
            })
            .state('main.new-request-n', {
                url: '/new-request-n',
                templateUrl: 'app/main/main.new-request-n.html'
            })
            .state('main.new-request-z', {
                url: '/new-request-z',
                templateUrl: 'app/main/main.new-request-z.html'
            })
            .state('main.sent-requests', {
                url: '/sent-requests',
                templateUrl: 'app/main/main.sent-requests.html'
            });
    }
})();

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
                name: 'main.new-request-n',
                label: 'Novi zahtjev za nastavnu aktivnost',
                icon: 'app/icons/ic_library_add_black_24px.svg',
                type: [0]
            },
            {
                name: 'main.new-request-z',
                label: 'Novi zahtjev za znanstvenu aktivnost',
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
