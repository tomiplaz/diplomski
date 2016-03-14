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
            getDocumentDialogObject: getDocumentDialogObject,
            getSignatureDialogObject: getSignatureDialogObject
        };

        function getDateTimeDialogObject(scope, event, data) {
            return {
                controller: 'DateTimeDialogCtrl as dateTimeDialog',
                templateUrl: 'app/main/date-time-dialog/date-time-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    data: data
                }
            }
        }

        function getDocumentDialogObject(event, data) {
            return {
                controller: 'DocumentDialogCtrl as documentDialog',
                templateUrl: 'app/main/document-dialog/document-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    data: data
                }
            }
        }

        function getSignatureDialogObject(scope, event, data) {
            return {
                controller: 'SignatureDialogCtrl as signatureDialog',
                templateUrl: 'app/main/signature-dialog/signature-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    data: data
                }
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app')
        .factory('documentService', documentService);

    function documentService() {
        return {
            getDocument: getDocument
        };

        function getDocument(data) {
            return data.type == 'n' ? getRequestNDocument(data) : getRequestZDocument(data);
        }

        function getRequestNDocument(data) {
            return {
                pageSize: 'A4',
                pageMargins: 60,
                content: [
                    { text: "Sveučilište J. J. Strossmayera u Osijeku", style: 'header' },
                    { text: "Elektrotehnički fakultet", style: 'header' },
                    { text: "U Osijeku, " + data.documentDate, style: 'documentDate' },
                    { text: "Dekanu Elektrotehničkog fakulteta Osijek".toUpperCase(), style: ['center', 'titleTop'] },
                    { text: "Zahtjev za izdavanje putnog naloga".toUpperCase(), style: ['center', 'titleMiddle'] },
                    { text: "Najkasnije 7 dana prije putovanja", style: ['center', 'titleBottom'] },
                    { text: "Ime, prezime i radno mjesto:", style: 'regular' },
                    { text: data.name + " " + data.surname + ", " + data.workplace, style: 'input' },
                    { text: "Molim odobrenje službenog puta za (mjesto, fakultet, kolegij):", style: ['regular', 'topMargin10'] },
                    { text: data.forPlace + ", " + data.forFaculty + ", " + data.forSubject, style: 'input' },
                    {
                        columns: [
                            { text: "Vrijeme polaska:", style: ['regular', 'topMargin10'], width: '*' },
                            { text: "Vrijeme povratka:", style: ['regular', 'topMargin10'], width: '*' },
                            { text: "Trajanje putovanja:", style: ['regular', 'topMargin10'], width: '*' }
                        ]
                    },
                    {
                        columns: [
                            { text: data.startTimestamp, style: 'input', width: '*' },
                            { text: data.endTimestamp, style: 'input', width: '*' },
                            { text: getDuration(data.startTimestampRaw, data.endTimestampRaw), style: 'input', width: '*' }
                        ]
                    },
                    { text: "Svrha:", style: ['regular', 'topMargin10'] },
                    { text: data.purpose, style: 'input' },
                    { text: "Vrsta prijevoza:", style: ['regular', 'topMargin10'] },
                    { text: data.transportation, style: 'input' },
                    { text: "Troškovi terete:", style: ['regular', 'topMargin10'] },
                    { text: data.expensesResponsible, style: 'input' },
                    { text: "Obrazloženje:", style: 'regular' },
                    { text: data.expensesExplanation, style: 'input' },
                    {
                        columns: [
                            { text: "Podnositelj zahtjeva:", style: ['regular', 'topMargin70', 'left'] },
                            { text: "Odobrava:", style: ['regular', 'topMargin70', 'right'] }
                        ]
                    },
                    {
                        columns: [
                            { image: data.applicantSignature, width: 125, height: 35 },
                            { text: "", style: ['input', 'right'], width: 125, height: 35 }
                        ]
                    },
                    {
                        columns: [
                            { text: "", style: ['regular', 'left'] },
                            { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regular', 'right'] }
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 16,
                        bold: true
                    },
                    documentDate: {
                        fontSize: 12,
                        margin: [0, 8, 0, 30]
                    },
                    center: {
                        alignment: 'center'
                    },
                    titleTop: {
                        fontSize: 12
                    },
                    titleMiddle: {
                        fontSize: 15,
                        bold: true
                    },
                    titleBottom: {
                        fontSize: 13,
                        margin: [0, 0, 0, 36]
                    },
                    regular: {
                        fontSize: 11,
                        bold: true
                    },
                    input: {
                        fontSize: 13,
                        margin: [0, 0, 0, 8]
                    },
                    topMargin10: {
                        margin: [0, 20, 0, 0]
                    },
                    topMargin70: {
                        margin: [0, 70, 0, 0]
                    },
                    left: {
                        alignment: 'left'
                    },
                    right: {
                        alignment: 'right'
                    }
                }
            }
        }

        function getRequestZDocument() {

        }

        function getDuration(start, end) {
            var totalMs = new Date(end) - new Date(start);
            var totalHours = totalMs / 1000 / 60 / 60;
            var days = Math.round(totalHours / 24);
            var hours = Math.round(totalHours % 24);

            var daysString = days.toString();
            var daysSuffix = "", hoursSuffix = "" ;

            switch (daysString[daysString.length - 1]) {
                case "1":
                    if (days > 10 && daysString.substr(daysString - 2) == 11) daysSuffix += "a";
                    break;
                default:
                    daysSuffix += "a";
                    break;
            }

            switch (hours) {
                case 1: case 21:
                break;
                case 2: case 3: case 4: case 22: case 23: case 24:
                    hoursSuffix += "a";
                    break;
                default:
                    hoursSuffix += "i";
                    break;
            }

            return days + " dan" + daysSuffix + " i " + hours + " sat" + hoursSuffix;
        }
    }
})();
(function() {
    'use strict'

    angular
        .module('app')
        .factory('toastService', toastService);

    toastService.$inject = ['$mdToast'];
    function toastService($mdToast) {
        return {
            show: show
        };

        function show(text, duration) {
            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent(text)
                    .position('bottom right')
                    .capsule(true)
                    .hideDelay(duration == undefined ? 1500 : duration)
            );
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
            // change request structure?
            return Restangular.all('auth').customGET('user').then(function(res) {
                return res.user;
            }, function(error) {
                // show error message?
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

        vm.hide = hide;
        vm.cancel = cancel;
        vm.save = save;

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            $scope[data.ctrl][data.property] = null;
            hide();
        }

        function save($value) {
            $scope[data.ctrl][data.property + 'Raw'] = $value;

            if (data.property == 'endTimestamp') {
                if ($scope[data.ctrl]['startTimestamp'] != undefined && new Date($value) > new Date($scope[data.ctrl]['startTimestampRaw'])) {
                    $scope[data.ctrl][data.property] = $filter('date')(new Date($value), 'dd.MM.yyyy., HH:mm');
                }
            } else {
                $scope[data.ctrl][data.property] = $filter('date')(new Date($value), 'dd.MM.yyyy., HH:mm');
            }

            hide();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', '$filter', 'Restangular', 'toastService'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, $filter, Restangular, toastService) {
        var vm = this;

        vm.hide = hide;
        vm.send = send;

        $document.ready(function() {
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('.document-dialog iframe'));
                    iframe.attr('src', url);
                });
        });

        function hide() {
            $mdDialog.hide();
        }

        function send() {
            var newRequestN = {
                document_date: $filter('date')(new Date(), 'yyyy-MM-dd'),
                name: data.name,
                surname: data.surname,
                workplace: data.workplace,
                for_place: data.forPlace,
                for_faculty: data.forFaculty,
                for_subject: data.forSubject,
                start_timestamp: $filter('date')(new Date(data.startTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                end_timestamp: $filter('date')(new Date(data.endTimestampRaw), 'yyyy-MM-dd HH:mm:ss'),
                purpose: data.purpose,
                transportation: data.transportation,
                expenses_responsible: data.expensesResponsible,
                expenses_explanation: data.expensesExplanation,
                applicant_signature: data.applicantSignature
            };

            Restangular.all('request-ns').post(newRequestN).then(function() {
                hide();
                toastService.show("Dokument spremljen!");
            }, function() {
                hide();
                toastService.show("Greška tijekom spremanja dokumenta!", 3000);
            });
        }
    }
})();
(function() {
    angular
        .module('main')
        .controller('NewRequestNCtrl', NewRequestNCtrl);

    NewRequestNCtrl.$inject = ['$scope', 'dialogService', '$mdDialog', '$filter'];
    function NewRequestNCtrl($scope, dialogService, $mdDialog, $filter) {
        var vm = this;

        vm.showDateTimeDialog = showDateTimeDialog;
        vm.showDocumentDialog = showDocumentDialog;
        vm.sign = sign;
        vm.clear = clear;

        function showDateTimeDialog($event, label, property) {
            var mindate = formatDate();
            var maxdate;

            if (property == 'startTimestamp') {
                if (vm.endTimestamp) {
                    maxdate = formatDate(vm.endTimestampRaw);
                }
            } else if (property == 'endTimestamp') {
                if (vm.startTimestamp) {
                    mindate = formatDate(vm.startTimestampRaw);
                }
            }

            var data = {
                label: label,
                ctrl: 'newRequestN',
                property: property,
                mindate: mindate,
                maxdate: maxdate
            };

            var dateTimeDialogObject = dialogService.getDateTimeDialogObject($scope, $event, data);
            $mdDialog.show(dateTimeDialogObject);
        }

        function showDocumentDialog($event) {
            var data = {
                type: 'n',
                documentDate: $filter('date')(new Date(), 'dd.MM.yyyy.'),
                name: vm.name,
                surname: vm.surname,
                workplace: vm.workplace,
                forPlace: vm.forPlace,
                forFaculty: vm.forFaculty,
                forSubject: vm.forSubject,
                startTimestamp: vm.startTimestamp,
                endTimestamp: vm.endTimestamp,
                startTimestampRaw: vm.startTimestampRaw,
                endTimestampRaw: vm.endTimestampRaw,
                purpose: vm.purpose,
                transportation: vm.transportation,
                expensesResponsible: vm.expensesResponsible,
                expensesExplanation: vm.expensesExplanation,
                applicantSignature: vm.applicantSignature
            };

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
        }

        function sign($event) {
            var data = {
                ctrl: 'newRequestN'
            };

            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, data);
            $mdDialog.show(signatureDialogObject);
        }

        function clear() {
            vm.name = null;
            vm.surname = null;
            vm.workplace = null;
            vm.forPlace = null;
            vm.forFaculty = null;
            vm.forSubject = null;
            vm.startTimestamp = null;
            vm.endTimestamp = null;
            vm.startTimestampRaw = null;
            vm.endTimestampRaw = null;
            vm.purpose = null;
            vm.transportation = null;
            vm.expensesResponsible = null;
            vm.expensesExplanation = null;
            vm.applicantSignature = null;
        }

        function formatDate(value) {
            return $filter('date')(!value ? new Date() : new Date(value), "yyyy/MM/dd");
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('SignatureDialogCtrl', SignatureDialogCtrl);

    SignatureDialogCtrl.$inject = ['$scope', '$mdDialog', '$document', 'data'];
    function SignatureDialogCtrl($scope, $mdDialog, $document, data) {
        var vm = this;
        var signaturePad = null;
        var confirmButton = null;

        vm.hide = hide;
        vm.clear = clear;
        vm.confirm = confirm;

        $document.ready(function() {
            var canvas = document.querySelector('canvas');
            signaturePad = new SignaturePad(canvas, {
                minWidth: 0.4,
                maxWidth: 1.0,
                onEnd: onEnd
            });

            confirmButton = angular.element(document.querySelector('button[ng-click="signatureDialog.confirm()"]'));
            confirmButton.attr('disabled', 'true');
        });

        function hide() {
            $mdDialog.hide();
        }

        function clear() {
            signaturePad.clear();
            confirmButton.attr('disabled', 'true');
        }

        function confirm() {
            $scope[data.ctrl]['applicantSignature'] = signaturePad.toDataURL();
            hide();
        }

        function onEnd() {
            if (!signaturePad.isEmpty()) {
                confirmButton.removeAttr('disabled');
            }
        }
    }
})();