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
        defaultDate: new Date(Date.now() + 7 * 86400000),
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

    function configure($urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider, $mdIconProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('blue')
            .warnPalette('amber')
            .backgroundPalette('grey');

        $mdIconProvider
            .icon('check', 'app/icons/ic_check_black_24px.svg')
            .icon('close', 'app/icons/ic_close_black_24px.svg')
            .icon('delete', 'app/icons/ic_delete_black_24px.svg')
            .icon('edit', 'app/icons/ic_edit_black_24px.svg')
            .icon('home', 'app/icons/ic_home_black_24px.svg')
            .icon('library_add', 'app/icons/ic_library_add_black_24px.svg')
            .icon('library_books', 'app/icons/ic_library_books_black_24px.svg')
            .icon('menu', 'app/icons/ic_menu_black_24px.svg')
            .icon('picture_as_pdf', 'app/icons/ic_picture_as_pdf_black_24px.svg')
            .icon('save', 'app/icons/ic_save_black_24px.svg')
            .icon('send', 'app/icons/ic_send_black_24px.svg')
            .icon('navigate_before', 'app/icons/ic_navigate_before_black_24px.svg')
            .icon('navigate_next', 'app/icons/ic_navigate_next_black_24px.svg')
            .icon('check_circle', 'app/icons/ic_check_circle_black_24px.svg')
            .icon('cancel', 'app/icons/ic_cancel_black_24px.svg')
            .icon('thumb_down', 'app/icons/ic_thumb_down_black_24px.svg')
            .icon('thumb_up', 'app/icons/ic_thumb_up_black_24px.svg')
            .icon('thumbs_up_down', 'app/icons/ic_thumbs_up_down_black_24px.svg')
            .icon('details', 'app/icons/ic_details_black_24px.svg');


        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');
    }
})();
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
(function() {
    'use strict';

    angular
        .module('app')
        .factory('dialogService', dialogService);

    function dialogService() {
        return {
            getDateTimeDialogObject: getDateTimeDialogObject,
            getDocumentDialogObject: getDocumentDialogObject,
            getSignatureDialogObject: getSignatureDialogObject,
            getRejectRequestDialogObject: getRejectRequestDialogObject,
            getDetailsDialogObject: getDetailsDialogObject
        };

        function getDateTimeDialogObject(scope, event, data) {
            return {
                controller: 'DateTimeDialogCtrl as dateTimeDialog',
                templateUrl: 'app/main/dialogs/date-time-dialog/date-time-dialog.html',
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
                templateUrl: 'app/main/dialogs/document-dialog/document-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    data: data
                }
            }
        }

        function getSignatureDialogObject(scope, event, requestId, type) {
            return {
                controller: 'SignatureDialogCtrl as signatureDialog',
                templateUrl: 'app/main/dialogs/signature-dialog/signature-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    requestId: requestId,
                    type: type
                }
            }
        }

        function getRejectRequestDialogObject(event, requestId, type) {
            return {
                controller: 'RejectRequestDialogCtrl as rejectRequestDialog',
                templateUrl: 'app/main/dialogs/reject-request-dialog/reject-request-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    requestId: requestId,
                    type: type
                }
            }
        }

        function getDetailsDialogObject(event, request) {
            return {
                controller: 'DetailsDialogCtrl as detailsDialog',
                templateUrl: 'app/main/dialogs/details-dialog/details-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    request: request
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
            return {
                pageSize: 'A4',
                pageMargins: 60,
                content: getContent(data),
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
                    topMargin20: {
                        margin: [0, 20, 0, 0]
                    },
                    topMargin40: {
                        margin: [0, 40, 0, 0]
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

        function getContent(data) {
            var topContent = [
                { text: "Sveučilište J. J. Strossmayera u Osijeku", style: 'header' },
                { text: "Elektrotehnički fakultet", style: 'header' },
                { text: "U Osijeku, " + data.documentDate, style: 'documentDate' },
                { text: "Dekanu Elektrotehničkog fakulteta Osijek".toUpperCase(), style: ['center', 'titleTop'] },
                { text: "Zahtjev za izdavanje putnog naloga".toUpperCase(), style: ['center', 'titleMiddle'] },
                { text: "Najkasnije 7 dana prije putovanja", style: ['center', 'titleBottom'] },
                { text: "Ime, prezime i radno mjesto:", style: 'regular' },
                { text: data.name + " " + data.surname + ", " + data.workplace, style: 'input' }
            ];
            var centerContentN = [
                { text: "Molim odobrenje službenog puta za (mjesto, fakultet, kolegij):", style: ['regular', 'topMargin20'] },
                { text: data.forPlace + ", " + data.forFaculty + ", " + data.forSubject, style: 'input' }
            ];
            var centerContentZorS = [
                { text: "Molim odobrenje službenog puta za (mjesto, akontacija):", style: ['regular', 'topMargin20'] },
                { text: data.forPlace + ", " + data.advancePayment, style: 'input' }
            ];
            var bottomContent = [
                {
                    columns: [
                        { text: "Vrijeme polaska:", style: ['regular', 'topMargin20'], width: '*' },
                        { text: "Vrijeme povratka:", style: ['regular', 'topMargin20'], width: '*' },
                        { text: "Trajanje putovanja:", style: ['regular', 'topMargin20'], width: '*' }
                    ]
                },
                {
                    columns: [
                        { text: data.startTimestamp, style: 'input', width: '*' },
                        { text: data.endTimestamp, style: 'input', width: '*' },
                        { text: data.duration, style: 'input', width: '*' }
                    ]
                },
                { text: "Svrha:", style: ['regular', 'topMargin20'] },
                { text: data.description, style: 'input' },
                { text: "Vrsta prijevoza:", style: ['regular', 'topMargin20'] },
                { text: data.transportation, style: 'input' },
                { text: "Troškovi terete:", style: ['regular', 'topMargin20'] },
                { text: data.expensesResponsible, style: 'input' },
                { text: "Obrazloženje:", style: 'regular' },
                { text: data.expensesExplanation, style: 'input' },
                {
                    columns: [
                        { text: "Podnositelj zahtjeva:", style: ['regular', 'topMargin40', 'left'] },
                        { text: "Odobrava:", style: ['regular', 'topMargin40', 'right'] }
                    ]
                },
                {
                    columns: [
                        { image: data.applicantSignature, width: 125, height: 35 },
                        { text: "", width: '*' },
                        !data.approverSignature ? {} : { image: data.approverSignature, width: 125, height: 35 }
                    ]
                },
                {
                    columns: [
                        { text: "", style: ['regular', 'left'] },
                        { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regular', 'right'] }
                    ]
                }
            ];

            return topContent.concat(data.type == 'n' ? centerContentN : centerContentZorS, bottomContent);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app')
        .factory('helperService', helperService);

    helperService.$inject = ['$filter'];
    function helperService($filter) {
        return {
            formatDate: formatDate,
            getDuration: getDuration
        };

        function formatDate(timestamp, format) {
            return $filter('date')(!timestamp ? new Date() : new Date(timestamp), format);
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
    'use strict';

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
                    .hideDelay(duration == undefined ? 2000 : duration)
            );
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

    LoginCtrl.$inject = ['$auth', '$state', 'toastService'];
    function LoginCtrl($auth, $state, toastService) {
        var vm = this;
        vm.login = login;
        vm.user = null;

        function login() {
            $auth.login({ email: vm.email, password: vm.password }).then(function() {
                $state.go('main.home');
            }, function() {
                toastService.show("Greška tijekom autentikacije!", 3000);
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('requests', []);
})();

(function() {
    'use strict';

    angular
        .module('requests')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main.requests', {
                abstract: true,
                url: '/requests',
                templateUrl: 'app/main/requests/requests.html',
                controller: 'RequestsCtrl as requests'
            })
            .state('main.requests.validate', {
                url: '/validate',
                templateUrl: 'app/main/requests/validate/validate.html',
                controller: 'ValidateCtrl as validate',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('nonvalidated');
                    }
                }
            })
            .state('main.requests.approve', {
                url: '/approve',
                templateUrl: 'app/main/requests/approve/approve.html',
                controller: 'ApproveCtrl as approve',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('approvable');
                    }
                }
            })
            .state('main.requests.sent', {
                url: '/sent',
                templateUrl: 'app/main/requests/sent/sent.html',
                controller: 'SentCtrl as sent',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('user');
                    }
                }
            });
    }
})();

(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsCtrl', RequestsCtrl);

    RequestsCtrl.$inject = ['documentService', 'helperService'];
    function RequestsCtrl(documentService, helperService) {
        var vm = this;

        vm.requests = null;
        vm.current = null;

        vm.init = init;
        vm.previous = previous;
        vm.next = next;
        vm.formatDate = helperService.formatDate;
        vm.select = select;

        function select(index) {
            vm.current = index;
            setRequest(index);
        }

        function init() {
            if (vm.requests.length > 0) {
                vm.current = 0;
                setRequest(0);
            }
        }

        function previous() {
            setRequest(--vm.current);
        }

        function next() {
            setRequest(++vm.current);
        }

        function setRequest(i) {
            vm.current = i;
            var data = getRequestDataObject(vm.requests[i]);
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('iframe'));
                    iframe.attr('src', url);
                });
        }

        function getRequestDataObject(request) {
            return {
                type: request.type,
                documentDate: helperService.formatDate(request.document_date, 'dd.MM.yyyy.'),
                name: request.name,
                surname: request.surname,
                workplace: request.workplace,
                forPlace: request.for_place,
                forFaculty: request.for_faculty,
                forSubject: request.for_subject,
                advancePayment: request.advance_payment,
                startTimestamp: helperService.formatDate(request.start_timestamp, 'dd.MM.yyyy. HH:mm'),
                endTimestamp: helperService.formatDate(request.end_timestamp, 'dd.MM.yyyy. HH:mm'),
                duration: request.duration,
                description: request.description,
                transportation: request.transportation,
                expensesResponsible: request.expenses_responsible,
                expensesExplanation: request.expenses_explanation,
                applicantSignature: request.applicant_signature,
                approverSignature: request.approver_signature
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main', ['requests']);
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
                    user: function(apiService) {
                        return apiService.getUser();
                    }
                }
            })
            .state('main.home', {
                url: '/home',
                templateUrl: 'app/main/main.home.html'
            })
            .state('main.new-request', {
                url: '/new-request',
                templateUrl: 'app/main/new-request/new-request.html',
                controller: 'NewRequestCtrl as newRequest'
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
                icon: 'home',
                type: [0, 1, 2, 3]
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
        .controller('NewRequestCtrl', NewRequestCtrl);

    NewRequestCtrl.$inject = ['$scope', '$state', 'dialogService', '$mdDialog', 'helperService'];
    function NewRequestCtrl($scope, $state, dialogService, $mdDialog, helperService) {
        if ($scope['main'].user.type != 0) return $state.go('main.home');

        var vm = this;

        vm.showDateTimeDialog = showDateTimeDialog;
        vm.showDocumentDialog = showDocumentDialog;
        vm.sign = sign;
        vm.clear = clear;

        function showDateTimeDialog($event, label, property) {
            var mindate = helperService.formatDate(Date.now() + 7 * 86400000, 'yyyy/MM/dd');
            var maxdate;

            if (property == 'startTimestamp') {
                if (vm.endTimestamp) {
                    maxdate = helperService.formatDate(vm.endTimestampRaw, 'yyyy/MM/dd');
                }
            } else if (property == 'endTimestamp') {
                if (vm.startTimestamp) {
                    mindate = helperService.formatDate(vm.startTimestampRaw, 'yyyy/MM/dd');
                }
            }

            var data = {
                label: label,
                property: property,
                mindate: mindate,
                maxdate: maxdate
            };

            var dateTimeDialogObject = dialogService.getDateTimeDialogObject($scope, $event, data);
            $mdDialog.show(dateTimeDialogObject);
        }

        function showDocumentDialog($event) {
            var data = {
                userId: $scope['main'].user.id,
                type: vm.type,
                documentDate: helperService.formatDate(null, 'dd.MM.yyyy.'),
                name: vm.name,
                surname: vm.surname,
                workplace: vm.workplace,
                forPlace: vm.forPlace,
                forFaculty: vm.forFaculty,
                forSubject: vm.forSubject,
                advancePayment: vm.advancePayment,
                startTimestamp: vm.startTimestamp,
                endTimestamp: vm.endTimestamp,
                startTimestampRaw: vm.startTimestampRaw,
                endTimestampRaw: vm.endTimestampRaw,
                duration: helperService.getDuration(vm.startTimestampRaw, vm.endTimestampRaw),
                description: vm.description,
                transportation: vm.transportation,
                expensesResponsible: vm.expensesResponsible,
                expensesExplanation: vm.expensesExplanation,
                applicantSignature: vm.applicantSignature
            };

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
        }

        function sign($event) {
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, null, 0);
            $mdDialog.show(signatureDialogObject);
        }

        function clear() {
            vm.type = null;
            vm.name = null;
            vm.surname = null;
            vm.workplace = null;
            vm.forPlace = null;
            vm.forFaculty = null;
            vm.forSubject = null;
            vm.advancePayment = null;
            vm.startTimestamp = null;
            vm.endTimestamp = null;
            vm.startTimestampRaw = null;
            vm.endTimestampRaw = null;
            vm.description = null;
            vm.transportation = null;
            vm.expensesResponsible = null;
            vm.expensesExplanation = null;
            vm.applicantSignature = null;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('DateTimeDialogCtrl', DateTimeDialogCtrl);

    DateTimeDialogCtrl.$inject = ['$scope', '$mdDialog', 'data', 'helperService'];
    function DateTimeDialogCtrl($scope, $mdDialog, data, helperService) {
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
            $scope['newRequest'][data.property] = null;
            hide();
        }

        function save($value) {
            $scope['newRequest'][data.property + 'Raw'] = $value;

            if (data.property == 'endTimestamp') {
                if ($scope['newRequest']['startTimestamp'] != undefined && new Date($value) > new Date($scope['newRequest']['startTimestampRaw'])) {
                    $scope['newRequest'][data.property] = helperService.formatDate($value, 'dd.MM.yyyy., HH:mm');
                }
            } else {
                $scope['newRequest'][data.property] = helperService.formatDate($value, 'dd.MM.yyyy., HH:mm');
            }

            hide();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('DetailsDialogCtrl', DetailsDialogCtrl);

    DetailsDialogCtrl.$inject = ['request', '$mdDialog', 'helperService'];
    function DetailsDialogCtrl(request, $mdDialog, helperService) {
        var vm = this;

        vm.hide = hide;

        vm.getCreationInfo = getCreationInfo;
        vm.getMainInfo = getMainInfo;
        vm.getReason = getReason;

        function hide() {
            $mdDialog.hide();
        }

        function getCreationInfo() {
            return "Zahtjev je poslan " + helperService.formatDate(request.created_at, "dd.MM.yyyy. 'u' HH:mm") + ".";
        }

        function getMainInfo() {
            if (request.quality_check == null) {
                return "Provjera ispravnosti zahtjeva još nije izvršena."
            } else if (request.quality_check == false) {
                return "Zahtjev je ocijenjen neispravnim " + helperService.formatDate(request.quality_check_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (request.approved) {
                return "Zahtjev je odobren " + helperService.formatDate(request.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (request.approved == false) {
                return "Zahtjev je odbijen " + helperService.formatDate(request.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else {
                return "Zahtjev je ispravan i čeka odobrenje.";
            }
        }

        function getReason() {
            if (request.invalidity_reason != null) {
                return request.invalidity_reason;
            } else if (request.disapproval_reason != null) {
                return request.disapproval_reason;
            } else {
                return null;
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('DocumentDialogCtrl', DocumentDialogCtrl);

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', 'helperService', 'apiService'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, helperService, apiService) {
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
            var newRequest = {
                user_id: data.userId,
                type: data.type,
                document_date: helperService.formatDate(null, 'yyyy-MM-dd'),
                name: data.name,
                surname: data.surname,
                workplace: data.workplace,
                for_place: data.forPlace,
                for_faculty: data.type != 'n' ? null : data.forFaculty,
                for_subject: data.type != 'n' ? null : data.forSubject,
                advance_payment: data.type == 'n' ? null : data.advancePayment,
                start_timestamp: helperService.formatDate(data.startTimestampRaw, 'yyyy-MM-dd HH:mm:ss'),
                end_timestamp: helperService.formatDate(data.endTimestampRaw, 'yyyy-MM-dd HH:mm:ss'),
                duration: data.duration,
                description: data.description,
                transportation: data.transportation,
                expenses_responsible: data.expensesResponsible,
                expenses_explanation: data.expensesExplanation,
                applicant_signature: data.applicantSignature
            };

            apiService.createRequest(newRequest);
            hide();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('RejectRequestDialogCtrl', RejectRequestDialogCtrl);

    RejectRequestDialogCtrl.$inject = ['$mdDialog', 'requestId', 'type', 'apiService', 'helperService'];
    function RejectRequestDialogCtrl($mdDialog, requestId, type, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        switch (type) {
            case 1:
                vm.title = "Neispravnost zahtjeva";
                vm.label = "Razlog neispravnosti";
                break;
            case 2:
                vm.title = "Odbijanje zahtjeva";
                vm.label = "Razlog odbijanja";
                break;
            default:
                vm.title = "Naslov";
                vm.label = "Labela";
                break;
        }

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = getDataObject();
            if (data != null) apiService.updateRequest(requestId, data, "Zahtjev uspješno odbijen!", true);
            hide();
        }

        function getDataObject() {
            switch (type) {
                case 1:
                    return {
                        quality_check: false,
                        quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        invalidity_reason: vm.reason
                    };
                case 2:
                    return {
                        approved: false,
                        approved_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        disapproval_reason: vm.reason
                    };
                default:
                    return null;
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('SignatureDialogCtrl', SignatureDialogCtrl);

    SignatureDialogCtrl.$inject = ['$scope', '$mdDialog', '$document', 'requestId', 'type', 'helperService', 'apiService'];
    function SignatureDialogCtrl($scope, $mdDialog, $document, requestId, type, helperService, apiService) {
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
            switch (type) {
                case 0:
                    $scope['newRequest']['applicantSignature'] = signaturePad.toDataURL();
                    break;
                case 2:
                    var data = {
                        approved: true,
                        approved_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        approver_signature: signaturePad.toDataURL()
                    };
                    apiService.updateRequest(requestId, data, "Zahtjev uspješno odobren!", true);
                    break;
                default:
                    break;
            }
            hide();
        }

        function onEnd() {
            if (!signaturePad.isEmpty()) {
                confirmButton.removeAttr('disabled');
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('ApproveCtrl', ApproveCtrl);

    ApproveCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function ApproveCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 2) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za odobravanje.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectRequestDialogObject = dialogService.getRejectRequestDialogObject($event, requestId, 2);
            $mdDialog.show(rejectRequestDialogObject);
        }

        function approve($event) {
            var requestId = requests[$scope['requests'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, requestId, 2);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('requests')
        .controller('SentCtrl', SentCtrl);

    SentCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function SentCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 0) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema poslanih zahtjeva.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.icon = getIcon($scope['requests'].current);
        vm.class = getClass($scope['requests'].current);
        vm.showDetails = showDetails;

        $scope.$watch('requests.current', function() {
            vm.icon = getIcon($scope['requests'].current);
            vm.class = getClass($scope['requests'].current);
            vm.classAria = getClassAria();
        });

        function showDetails($event) {
            var detailsDialogObject = dialogService.getDetailsDialogObject($event, requests[$scope['requests'].current]);
            $mdDialog.show(detailsDialogObject);
        }

        function getIcon(i) {
            if ($scope['requests'].requests[i].invalidity_reason || $scope['requests'].requests[i].disapproval_reason) {
                return 'thumb_down';
            } else if ($scope['requests'].requests[i].approved) {
                return 'thumb_up';
            } else return 'thumbs_up_down';
        }

        function getClass(i) {
            if ($scope['requests'].requests[i].invalidity_reason || $scope['requests'].requests[i].disapproval_reason) {
                return 'negative';
            } else if ($scope['requests'].requests[i].approved) {
                return 'positive';
            } else return 'pending';
        }

        function getClassAria() {
            if (vm.class == 'negative') {
                return 'Odbijen';
            } else if (vm.class == 'positive') {
                return 'Odobren';
            } else return 'U tijeku'
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('requests')
        .controller('ValidateCtrl', ValidateCtrl);

    ValidateCtrl.$inject = ['$scope', '$state', 'requests', 'helperService', 'dialogService', '$mdDialog', 'apiService'];
    function ValidateCtrl($scope, $state, requests, helperService, dialogService, $mdDialog, apiService) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za validaciju.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectRequestDialogObject = dialogService.getRejectRequestDialogObject($event, requestId, 1);
            $mdDialog.show(rejectRequestDialogObject);
        }

        function valid() {
            var requestId = requests[$scope['requests'].current].id;
            var data = {
                quality_check: true,
                quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
            };
            apiService.updateRequest(requestId, data, "Zahtjev uspješno prosljeđen!", true);
        }
    }
})();