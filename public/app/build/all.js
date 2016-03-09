(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer', 'scDateTime', 'login', 'main'
        ]);
})();

(function() {
    'use strict';

    var scDateTimeI18n = {
        previousMonth: "Prethodni mjesec",
        nextMonth: "Sljedeći mjesec",
        incrementHours: "Inkrementiraj sate",
        decrementHours: "Dekrementiraj sate",
        incrementMinutes: "Inkrementiraj minute",
        decrementMinutes: "Dekrementiraj minute",
        switchAmPm: "Promjeni AM/PM",
        now: "Sada",
        cancel: "Poništi",
        save: "Spremi",
        weekdays: ['N', 'P', 'U', 'S', 'Č', 'P', 'S'],
        switchTo: 'Promjeni na',
        clock: 'Sat',
        calendar: 'Kalendar'
    };

    var scDateTimeConfig = {
        defaultTheme: 'material',
        autosave: false,
        defaultMode: 'time',
        defaultDate: undefined,
        displayMode: 'full',
        defaultOrientation: false,
        displayTwentyfour: true,
        compact: false
    };

    angular
        .module('app')
        .config(configure)
        .value('scDateTimeI18n', scDateTimeI18n)
        .value('scDateTimeConfig', scDateTimeConfig);

    function configure($urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('blue')
            .warnPalette('amber')
            .backgroundPalette('grey');

        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');
    }
})();
(function() {
    'use strict'

    angular
        .module('app')
        .factory('dialogService', dialogService);

    function dialogService() {
        return {
            getDateTimeDialogObject: getDateTimeDialogObject,
            getDocumentDialogObject: getDocumentDialogObject
        };

        function getDateTimeDialogObject(scope, event, label, ctrl, property, mindate, maxdate) {
            return {
                controller: 'DateTimeDialogCtrl as dateTimeDialog',
                templateUrl: 'app/main/date-time-dialog/date-time-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {
                    data: {
                        label: label,
                        ctrl: ctrl,
                        property: property,
                        mindate: mindate,
                        maxdate: maxdate
                    }
                }
            }
        }

        function getDocumentDialogObject(scope, event) {
            return {
                controller: 'DocumentDialogCtrl as documentDialog',
                templateUrl: 'app/main/document-dialog/document-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true
            }
        }
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
                abstract: true,
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
                templateUrl: 'app/main/new-request-n/new-request-n.html',
                controller: 'NewRequestNCtrl as newRequestN'
            })
            .state('main.new-request-z', {
                url: '/new-request-z',
                templateUrl: 'app/main/new-request-z/new-request-z.html'
            })
            .state('main.sent-requests', {
                url: '/sent-requests',
                templateUrl: 'app/main/sent-requests/sent-requests.html'
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
                label: 'Novi zahtjev (nastavna aktivnost)',
                icon: 'app/icons/ic_library_add_black_24px.svg',
                type: [0]
            },
            {
                name: 'main.new-request-z',
                label: 'Novi zahtjev (znanstvena aktivnost)',
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

(function() {
    'use strict';

    angular
        .module('main')
        .controller('DateTimeDialogCtrl', DateTimeDialogCtrl);

    DateTimeDialogCtrl.$inject = ['$scope', '$mdDialog', 'data', '$filter'];
    function DateTimeDialogCtrl($scope, $mdDialog, data, $filter) {
        var vm = this;

        vm.label = data.label;
        vm.mindate = data.mindate;
        vm.maxdate = data.maxdate;

        vm.cancel = cancel;
        vm.save = save;
        vm.hide = hide;

        function cancel() {
            $scope[data.ctrl][data.property] = null;

            $mdDialog.hide();
        }

        function save($value) {
            $scope[data.ctrl][data.property + 'Raw'] = $value;
            $scope[data.ctrl][data.property] = $filter('date')(new Date($value), "dd.MM.yyyy., HH:mm");

            $mdDialog.hide();
        }

        function hide() {
            $mdDialog.hide();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog'];
    function DocumentDialogCtrl($mdDialog) {
        var vm = this;

        vm.hide = hide;

        function hide() {
            $mdDialog.hide();
        }
    }
})();
(function() {
    angular
        .module('main')
        .controller('NewRequestNCtrl', NewRequestNCtrl);

    NewRequestNCtrl.$inject = ['$scope', 'dialogService', '$mdDialog', '$filter', '$mdToast'];
    function NewRequestNCtrl($scope, dialogService, $mdDialog, $filter, $mdToast) {
        var vm = this;

        vm.showDateTimeDialog = showDateTimeDialog;
        vm.showDocument = showDocument;
        vm.saveDocument = saveDocument;

        function showDateTimeDialog($event, label, ctrl, property) {
            var mindate = formatDate();
            var maxdate;

            if (property == 'startTime') {
                if (vm.endTime) {
                    maxdate = formatDate(vm.endTimeRaw);
                }
            } else if (property == 'endTime') {
                if (vm.startTime) {
                    mindate = formatDate(vm.startTimeRaw);
                }
            }

            var dateTimeDialogObject = dialogService.getDateTimeDialogObject($scope, $event, label, ctrl, property, mindate, maxdate);
            $mdDialog.show(dateTimeDialogObject);
        }

        function saveDocument() {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent("Dokument spremljen!")
                    .position('top right')
                    .hideDelay(1500)
            );
        }

        function showDocument($event) {
            var documentDialogObject = dialogService.getDocumentDialogObject($scope, $event);
            $mdDialog.show(documentDialogObject);
        }

        function formatDate(value) {
            return $filter('date')(!value ? new Date() : new Date(value), "yyyy/MM/dd");
        }
    }

    // explanation to text; test pdf and use ng-maxlength for each
})();