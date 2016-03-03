(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer', 'login', 'users'
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
            .primaryPalette('light-green')
            .accentPalette('amber')
            .warnPalette('red')
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

    userService.$inject = ['Restangular'];
    function userService(Restangular) {
        return {
            getUser: getUser
        };

        function getUser() {
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
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

    LoginCtrl.$inject = ['$auth', '$state', 'userService'];
    function LoginCtrl($auth, $state, userService) {
        var vm = this;
        vm.login = login;
        vm.user = null;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                userService.getUser().then(function(user) {
                    $state.go('users.' + user.type + '.home');
                });
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('users', ['users.0', 'users.1']);
})();

(function() {
    'use strict';

    angular
        .module('users')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('users', {
                abastract: true,
                url: '/users',
                templateUrl: 'app/users/users.html',
                controller: 'UsersCtrl as users',
                resolve: {
                    user: function(userService) {
                        return userService.getUser();
                    }
                }
            });
    }
})();

(function() {
    'use strict';

    angular
        .module('users')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['user'];
    function UsersCtrl(user) {
        var vm = this;
        vm.user = user;
    }
})();

(function() {
    'use strict';

    angular
        .module('users.0', []);
})();

(function() {
    'use strict';

    angular
        .module('users.0')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('users.0', {
                abastract: true,
                url: '/0',
                templateUrl: 'app/users/0/users.0.html'
            })
            .state('users.0.home', {
                url: '/home',
                templateUrl: 'app/users/0/users.0.home.html',
                controller: 'Users0Ctrl as users0'
            })
    }
})();

(function() {
    'use strict';

    angular
        .module('users.0')
        .controller('Users0Ctrl', Users0Ctrl);

    Users0Ctrl.$inject = [];
    function Users0Ctrl() {
        var vm = this;
        vm.hey = 'Hey!';
    }
})();

(function() {
    'use strict';

    angular
        .module('users.1', []);
})();

(function() {
    'use strict';

    angular
        .module('users.1')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('users.1', {
                abastract: true,
                url: '/1',
                templateUrl: 'app/users/1/users.1.html'
            })
            .state('users.1.home', {
                url: '/home',
                templateUrl: 'app/users/1/users.1.home.html',
                controller: 'Users1Ctrl as users1'
            })
    }
})();

(function() {
    'use strict';

    angular
        .module('users.1')
        .controller('Users1Ctrl', Users1Ctrl);

    Users1Ctrl.$inject = [];
    function Users1Ctrl() {
        var vm = this;
        vm.hey = 'Hey!';
    }
})();
