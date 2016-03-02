(function() {
    'use strict';

    angular
        .module('app', ['ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer', 'login']);
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

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                alert("!");
            });
        }
    }
})();