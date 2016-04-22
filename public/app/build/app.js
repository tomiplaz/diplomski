(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router', 'restangular', 'ngMaterial', 'ngMessages', 'satellizer', 'scDateTime', 'ngFileUpload', 'login', 'main'
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
            .icon('details', 'app/icons/ic_details_black_24px.svg')
            .icon('add_circle', 'app/icons/ic_add_circle_black_24px.svg')
            .icon('remove_circle', 'app/icons/ic_remove_circle_black_24px.svg')
            .icon('attachment', 'app/icons/ic_attachment_black_24px.svg')
            .icon('file_download', 'app/icons/ic_file_download_black_24px.svg');


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
            getRejectDialogObject: getRejectDialogObject,
            getDetailsDialogObject: getDetailsDialogObject,
            getMarkRequestDialogObject: getMarkRequestDialogObject
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

        function getSignatureDialogObject(scope, event, docType, docId, userType) {
            return {
                controller: 'SignatureDialogCtrl as signatureDialog',
                templateUrl: 'app/main/dialogs/signature-dialog/signature-dialog.html',
                parent: angular.element(document.body),
                scope: scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    docType: docType,
                    docId: docId,
                    userType: userType
                }
            }
        }

        function getRejectDialogObject(event, docType, docId, userType, warrant) {
            return {
                controller: 'RejectDialogCtrl as rejectDialog',
                templateUrl: 'app/main/dialogs/reject-dialog/reject-dialog-' + (userType != 3 ? 'reason' : 'bill') + '.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    docType: docType,
                    docId: docId,
                    userType: userType,
                    warrant: warrant
                }
            }
        }

        function getDetailsDialogObject(event, doc) {
            return {
                controller: 'DetailsDialogCtrl as detailsDialog',
                templateUrl: 'app/main/dialogs/details-dialog/details-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    doc: doc
                }
            }
        }

        function getMarkRequestDialogObject(event, requestId) {
            return {
                controller: 'MarkRequestDialogCtrl as markRequestDialog',
                templateUrl: 'app/main/dialogs/mark-request-dialog/mark-request-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    requestId: requestId
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
                content: !data.report ? getRequestContent(data) : getWarrantContent(data),
                styles: {
                    header: {
                        fontSize: 16,
                        bold: true
                    },
                    documentDate: {
                        fontSize: 12,
                        margin: [0, 8, 0, 30]
                    },
                    titleHeader: {
                        fontSize: 12,
                        alignment: 'center'
                    },
                    titleMain: {
                        fontSize: 15,
                        bold: true,
                        alignment: 'center'
                    },
                    titleFooter: {
                        fontSize: 13,
                        margin: [0, 0, 0, 36],
                        alignment: 'center'
                    },
                    regularBold: {
                        fontSize: 11,
                        bold: true
                    },
                    inputBottomMargin: {
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
                    },
                    regular: {
                        fontSize: 11
                    },
                    inputItalics: {
                        fontSize: 13,
                        italics: true
                    },
                    bold: {
                        bold: true
                    },
                    titleStandalone: {
                        fontSize: 15,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 36]
                    },
                    tableHeader: {
                        bold: true,
                        alignment: 'center'
                    },
                    center: {
                        alignment: 'center'
                    },
                    inputBold: {
                        fontSize: 13,
                        bold: true
                    },
                    bottomMargin10: {
                        margin: [0, 0, 0, 10]
                    },
                    bottomMargin30: {
                        margin: [0, 0, 0, 30]
                    }
                }
            }
        }

        function getRequestContent(data) {
            var topContent = [
                { text: "Sveučilište J. J. Strossmayera u Osijeku", style: 'header' },
                { text: "Elektrotehnički fakultet", style: 'header' },
                { text: "U Osijeku, " + data.documentDate, style: 'documentDate' },
                { text: "Dekanu Elektrotehničkog fakulteta Osijek".toUpperCase(), style: ['center', 'titleHeader'] },
                { text: "Zahtjev za izdavanje putnog naloga".toUpperCase(), style: ['center', 'titleMain'] },
                { text: "Najkasnije 7 dana prije putovanja", style: ['center', 'titleFooter'] },
                { text: "Ime, prezime i radno mjesto:", style: 'regularBold' },
                { text: data.name + " " + data.surname + ", " + data.workplace, style: 'inputBottomMargin' }
            ];
            var centerContentN = [
                { text: "Molim odobrenje službenog puta za (mjesto, fakultet, kolegij):", style: ['regularBold', 'topMargin20'] },
                { text: data.forPlace + ", " + data.forFaculty + ", " + data.forSubject, style: 'inputBottomMargin' }
            ];
            var centerContentZorS = [
                {
                    columns: [
                        { text: "Molim odobrenje službenog puta za (mjesto):", style: ['regularBold', 'topMargin20'], width: '60%' },
                        { text: "Voditelj projekta:", style: ['regularBold', 'topMargin20'], width: '*' }
                    ]
                },
                {
                    columns: [
                        { text: data.forPlace, style: 'inputBottomMargin', width: '60%' },
                        { text: data.projectLeader, style: 'inputBottomMargin', width: '*' }
                    ]
                }
            ];
            var bottomContent = [
                {
                    columns: [
                        { text: "Vrijeme polaska:", style: ['regularBold', 'topMargin20'], width: '*' },
                        { text: "Vrijeme povratka:", style: ['regularBold', 'topMargin20'], width: '*' },
                        { text: "Trajanje putovanja:", style: ['regularBold', 'topMargin20'], width: '*' }
                    ]
                },
                {
                    columns: [
                        { text: data.startTimestamp, style: 'inputBottomMargin', width: '*' },
                        { text: data.endTimestamp, style: 'inputBottomMargin', width: '*' },
                        { text: data.duration, style: 'inputBottomMargin', width: '*' }
                    ]
                },
                { text: "Svrha (" + getTypeFull(data.type) + "):", style: ['regularBold', 'topMargin20'] },
                { text: data.description, style: 'inputBottomMargin' },
                {
                    columns: [
                        { text: "Akontacija:", style: ['regularBold', 'topMargin20'], width: '20%' },
                        { text: "Vrsta prijevoza:", style: ['regularBold', 'topMargin20'], width: '*' }
                    ]
                },
                {
                    columns: [
                        { text: data.advancePayment + " kn", style: 'inputBottomMargin', width: '20%' },
                        { text: data.transportation, style: 'inputBottomMargin', width: '*' }
                    ]
                },
                { text: "Troškovi terete:", style: ['regularBold', 'topMargin20'] },
                { text: data.expensesResponsible, style: 'inputBottomMargin' },
                { text: "Obrazloženje:", style: 'regularBold' },
                { text: data.expensesExplanation, style: 'inputBottomMargin' },
                {
                    columns: [
                        { text: "Podnositelj zahtjeva:", style: ['regularBold', 'topMargin40', 'left'] },
                        { text: "Odobrava:", style: ['regularBold', 'topMargin40', 'right'] }
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
                        { text: "", style: ['regularBold', 'left'] },
                        { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regularBold', 'right'] }
                    ]
                }
            ];

            return topContent.concat(data.type == 'n' ? centerContentN : centerContentZorS, bottomContent);
        }

        function getWarrantContent(data) {
            return [
                { text: "Sveučilište J. J. Strossmayera u Osijeku", style: 'header' },
                { text: "Elektrotehnički fakultet", style: 'header' },
                { text: "U Osijeku, " + data.documentDate, style: 'documentDate' },
                { text: "Putni nalog".toUpperCase(), style: ['center', 'titleMain'] },
                { text: "Broj: " + data.mark, style: ['center', 'titleFooter'] },
                {
                    text: [
                        { text: "Određujem da ", style: 'regular' },
                        { text: data.name + " " + data.surname, style: 'inputItalics' },
                        { text: " na radnom mjestu ", style: 'regular' },
                        { text: data.workplace, style: 'inputItalics' },
                        { text: " službeno otputuje ", style: 'regular' },
                        { text: data.startDate, style: 'inputItalics' },
                        { text: " u ", style: 'regular' },
                        { text: data.forPlace, style: 'inputItalics' },
                        { text: ".", style: 'regular' }
                    ]
                },
                { text: "Svrha putovanja (" + getTypeFull(data.type) + "):", style: ['regular', 'topMargin20'] },
                { text: data.description, style: 'inputItalics' },
                {
                    text: [
                        { text: "Putovanje može trajati ", style: 'regular' },
                        { text: data.durationDays.toString() + " dana", style: 'inputItalics' },
                        { text: ".", style: 'regular' }
                    ],
                    style: 'topMargin20'
                },
                {
                    text: [
                        { text: "Odobravam upotrebu prijevoznih sredstava: ", style: 'regular' },
                        { text: data.transportation.toLowerCase(), style: 'inputItalics' },
                        { text: ".", style: 'regular' }
                    ],
                    style: 'topMargin20'
                },
                {
                    text: [
                        { text: "Troškovi putovanja terete ", style: 'regular' },
                        { text: data.expensesResponsible, style: 'inputItalics' },
                        { text: ".", style: 'regular' }
                    ],
                    style: 'topMargin20'
                },
                {
                    text: [
                        { text: "Odobravam isplatu predujma u iznosu od ", style: 'regular' },
                        { text: data.advancePayment.toString() + " kn", style: 'inputItalics' },
                        { text: ".", style: 'regular' }
                    ],
                    style: 'topMargin20'
                },
                {
                    text: [
                        { text: "Nakon povratka u roku od ", style: 'regular' },
                        { text: "tri dana", style: 'bold'},
                        { text: " treba izvršiti obračun ovog putovanja i podnijeti pismeno izvješće.", style: 'regular'}
                    ],
                    style: 'topMargin20'
                },
                { text: "Odobrava:", style: ['regularBold', 'topMargin40', 'right'] },
                {
                    columns: [
                        { text: "", width: '*' },
                        { image: data.approverStartSignature, width: 125, height: 35 }
                    ]
                },
                { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regularBold', 'right'] },

                { text: "Putni račun".toUpperCase(), style: 'titleStandalone', pageBreak: 'before' },
                {
                    table: {
                        widths: ['*', '*', 'auto', 'auto'],
                        body: [
                            [
                                { text: "Obračun dnevnica".toUpperCase(), colSpan: 4, style: 'tableHeader' },
                                {},
                                {},
                                {}
                            ],
                            [
                                { text: "Polazak", style: 'tableHeader' },
                                { text: "Povratak", style: 'tableHeader' },
                                { text: "Broj dnevnica", style: 'tableHeader' },
                                { text: "Iznos (kn)", style: 'tableHeader' }
                            ],
                            [
                                { text: data.startTimestamp, style: 'center' },
                                { text: data.endTimestamp, style: 'center' },
                                { text: data.durationDays.toString(), style: 'center' },
                                { text: data.wage.toString(), style: 'center' }
                            ]
                        ]
                    },
                    style: 'bottomMargin10'
                },
                {
                    text: [
                        { text: "Ukupan iznos dnevnica: ", style: 'regular' },
                        { text: data.wagesTotal.toString() + " kn", style: 'inputBold' }
                    ],
                    style: ['bottomMargin30', 'right']
                },
                {
                    table: {
                        widths: ['*', '*', 'auto', 'auto'],
                        body: getRoutes(data)
                    },
                    style: 'bottomMargin10'
                },
                {
                    text: [
                        { text: "Ukupan iznos prijevoznih troškova: ", style: 'regular' },
                        { text: data.routesTotal.toString() + " kn", style: 'inputBold' }
                    ],
                    style: ['bottomMargin30', 'right']
                },
                {
                    table: {
                        widths: ['*', 'auto'],
                        body: getOther(data)
                    },
                    style: 'bottomMargin10'
                },
                {
                    text: [
                        { text: "Ukupan iznos ostalih troškova: ", style: 'regular' },
                        { text: data.otherTotal.toString() + " kn", style: 'inputBold' }
                    ],
                    style: ['bottomMargin30', 'right']
                },
                {
                    text: [
                        { text: "Sveukupno: ", style: 'regular' },
                        { text: data.allTotal.toString() + " kn", style: 'inputBold' }
                    ],
                    style: 'right'
                },
                {
                    columns: [
                        { text: "Podnositelj računa:", style: ['regularBold', 'topMargin40', 'left'] },
                        { text: "Pregledao likvidator:", style: ['regularBold', 'topMargin40', 'center'] },
                        { text: "Odobrava:", style: ['regularBold', 'topMargin40', 'right'] }
                    ]
                },
                {
                    columns: [
                        { image: data.applicantSignature, width: 125, height: 35 },
                        { text: "", width: '*' },
                        !data.accountantSignature ? {} : { image: data.accountantSignature, width: 125, height: 35 },
                        { text: "", width: '*' },
                        !data.approverSignature ? {} : { image: data.approverSignature, width: 125, height: 35 }
                    ]
                },
                { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regularBold', 'right'] },

                { text: "Izvješće".toUpperCase(), style: 'titleStandalone', pageBreak: 'before' },
                { text: data.report, style: 'inputItalics' },
                {
                    columns: [
                        { text: "Podnositelj izvješća:", style: ['regularBold', 'topMargin40', 'left'] },
                        { text: "Odobrava:", style: ['regularBold', 'topMargin40', 'right'] }
                    ]
                },
                {
                    columns: [
                        { image: data.applicantSignature, width: 125, height: 35 },
                        { text: "", width: '*' },
                        !data.approverSignature ? {} : { image: data.approverSignature, width: 125, height: 35 }
                    ]
                },
                { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regularBold', 'right'] }
            ];
        }

        function getTypeFull(type) {
            switch (type) {
                case 'n':
                    return "nastavna aktivnost";
                case 'z':
                    return "znanstvena aktivnost";
                case 's':
                    return "stručna aktivnost";
            }
        }

        function getRoutes(data) {
            var routes = [
                [
                    { text: "Obračun prijevoznih troškova".toUpperCase(), colSpan: 4, style: 'tableHeader' },
                    {},
                    {},
                    {}
                ],
                [
                    { text: "Od", style: 'tableHeader' },
                    { text: "Do", style: 'tableHeader' },
                    { text: "Prijevozno sredstvo", style: 'tableHeader' },
                    { text: "Iznos (kn)", style: 'tableHeader' }
                ]
            ];

            for (var i = 0; i < 7; i++) {
                if (data['routesFrom' + i]) {
                    routes.push([
                        { text: data['routesFrom' + i], style: 'center' },
                        { text: data['routesTo' + i], style: 'center' },
                        { text: data['routesTransportation' + i], style: 'center' },
                        { text: data['routesCost' + i].toString(), style: 'center' }
                    ]);
                }
            }

            return routes;
        }

        function getOther(data) {
            var other = [
                [
                    { text: "Obračun ostalih troškova".toUpperCase(), colSpan: 2, style: 'tableHeader' },
                    {}
                ],
                [
                    { text: "Opis troška", style: 'tableHeader' },
                    { text: "Iznos (kn)", style: 'tableHeader' }
                ]
            ];

            for (var i = 0; i < 4; i++) {
                if (data['otherDescription' + i]) {
                    other.push([
                        { text: data['otherDescription' + i], style: 'center' },
                        { text: data['otherCost' + i].toString(), style: 'center' }
                    ]);
                }
            }

            return other;
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
            getDuration: getDuration,
            formatTransportation: formatTransportation,
            getDurationDays: getDurationDays,
            getNumberOfRoutes: getNumberOfRoutes,
            getNumberOfOther: getNumberOfOther,
            areFilesExtensionsValid: areFilesExtensionsValid,
            isFilesArrayUnderMaxSize: isFilesArrayUnderMaxSize
        };

        function formatDate(timestamp, format) {
            return $filter('date')(!timestamp ? new Date() : new Date(timestamp), format);
        }

        function getDuration(start, end) {
            var totalMs = new Date(end) - new Date(start);
            var totalHours = totalMs / 1000 / 60 / 60;
            var days = Math.floor(totalHours / 24);
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

        function formatTransportation(value) {
            var options = ['autobus', 'automobil', 'vlak', 'zrakoplov', 'ostalo'];
            var result = "";

            for (var i = 0; i < 5; i++) {
                if (value.includes(options[i])) result += options[i] + ", ";
            }

            return _.capitalize(result.slice(0, -2));
        }

        function getDurationDays(start, end) {
            var totalMs = new Date(end) - new Date(start);
            var totalHours = totalMs / 1000 / 60 / 60;

            return Math.round(totalHours / 24);
        }

        function getNumberOfRoutes(warrant) {
            for (var i = 2; i < 7; i++) {
                if (!warrant['routes_cost_' + i]) return i;
            }
            return 7;
        }

        function getNumberOfOther(warrant) {
            for (var i = 0; i < 4; i++) {
                if (!warrant['other_cost_' + i]) return i;
            }
            return 4;
        }

        function getFileExtension(fileName) {
            var split = fileName.split('.');
            return split[split.length - 1];
        }

        function isFileExtensionValid(fileName) {
            var extension = getFileExtension(fileName);
            return _.includes(['pdf', 'png', 'jpeg', 'jpg'], extension);
        }

        function areFilesExtensionsValid(files) {
            for (var i = 0; i < files.length; i++) {
                if (!isFileExtensionValid(files[i].name)) return false;
            }
            return true;
        }

        function isFilesArrayUnderMaxSize(files) {
            var size = 0;

            for (var i = 0; i < files.length; i++) {
                size += files[i].size;
            }

            console.log(size);
            return size < 10000000;
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
            .state('main.requests.validation', {
                url: '/validation',
                templateUrl: 'app/main/requests/validation/validation.html',
                controller: 'RequestsValidationCtrl as requestsValidation',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('nonvalidated');
                    }
                }
            })
            .state('main.requests.approval', {
                url: '/approval',
                templateUrl: 'app/main/requests/approval/approval.html',
                controller: 'RequestsApprovalCtrl as requestsApproval',
                resolve: {
                    requests: function(apiService) {
                        return apiService.getRequests('approvable');
                    }
                }
            })
            .state('main.requests.sent', {
                url: '/sent',
                templateUrl: 'app/main/requests/sent/sent.html',
                controller: 'RequestsSentCtrl as requestsSent',
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

        vm.formatDate = helperService.formatDate;
        vm.init = init;
        vm.select = select;
        vm.previous = previous;
        vm.next = next;

        function init() {
            if (vm.requests.length > 0) {
                vm.current = 0;
                setRequest(0);
            }
        }

        function select(index) {
            vm.current = index;
            setRequest(index);
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
                projectLeader: request.project_leader,
                startTimestamp: helperService.formatDate(request.start_timestamp, 'dd.MM.yyyy. HH:mm'),
                endTimestamp: helperService.formatDate(request.end_timestamp, 'dd.MM.yyyy. HH:mm'),
                duration: request.duration,
                advancePayment: request.advance_payment,
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
        .module('warrants', []);
})();

(function() {
    'use strict';

    angular
        .module('warrants')
        .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('main.warrants', {
                abstract: true,
                url: '/warrants',
                templateUrl: 'app/main/warrants/warrants.html',
                controller: 'WarrantsCtrl as warrants'
            })
            .state('main.warrants.validation', {
                url: '/validation',
                templateUrl: 'app/main/warrants/validation/validation.html',
                controller: 'WarrantsValidationCtrl as warrantsValidation',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('nonvalidated');
                    }
                }
            })
            .state('main.warrants.approval', {
                url: '/approval',
                templateUrl: 'app/main/warrants/approval/approval.html',
                controller: 'WarrantsApprovalCtrl as warrantsApproval',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('approvable');
                    }
                }
            })
            .state('main.warrants.accounting', {
                url: '/accounting',
                templateUrl: 'app/main/warrants/accounting/accounting.html',
                controller: 'WarrantsAccountingCtrl as warrantsAccounting',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('nonaccounted');
                    }
                }
            })
            .state('main.warrants.sent', {
                url: '/sent',
                templateUrl: 'app/main/warrants/sent/sent.html',
                controller: 'WarrantsSentCtrl as warrantsSent',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('user/sent');
                    }
                }
            });
    }
})();

(function() {
    'use strict';

    angular
        .module('warrants')
        .controller('WarrantsCtrl', WarrantsCtrl);

    WarrantsCtrl.$inject = ['documentService', 'helperService', 'apiService'];
    function WarrantsCtrl(documentService, helperService, apiService) {
        var vm = this;

        vm.warrants = null;
        vm.current = null;
        vm.attachments = [];

        vm.formatDate = helperService.formatDate;
        vm.init = init;
        vm.select = select;
        vm.previous = previous;
        vm.next = next;
        vm.downloadAttachment = downloadAttachment;

        function init() {
            if (vm.warrants.length > 0) {
                vm.current = 0;
                setWarrant(0);
            }
        }

        function select(index) {
            vm.current = index;
            setWarrant(index);
        }

        function previous() {
            setWarrant(--vm.current);
        }

        function next() {
            setWarrant(++vm.current);
        }

        function setWarrant(i) {
            vm.current = i;
            var data = getWarrantDataObject(vm.warrants[i]);
            var doc = documentService.getDocument(data);

            pdfMake
                .createPdf(doc)
                .getDataUrl(function(url) {
                    var iframe = angular.element(document.querySelector('iframe.warrants-frame'));
                    iframe.attr('src', url);
                });

            apiService.getAttachments(data.warrantId).then(function(attachments) {
                vm.attachments = attachments.length == 0 ? null : attachments;
            });
        }

        function getWarrantDataObject(warrant) {
            var data = {
                warrantId: warrant.id,
                mark: warrant.mark,
                type: warrant.type,
                documentDate: helperService.formatDate(warrant.document_date, 'dd.MM.yyyy.'),
                name: warrant.name,
                surname: warrant.surname,
                workplace: warrant.workplace,
                startDate: helperService.formatDate(warrant.start_timestamp, 'dd.MM.yyyy.'),
                forPlace: warrant.for_place,
                description: warrant.description,
                startTimestamp: helperService.formatDate(warrant.start_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                endTimestamp: helperService.formatDate(warrant.end_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                durationDays: helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp),
                transportation: warrant.transportation,
                expensesResponsible: warrant.expenses_responsible,
                advancePayment: warrant.advance_payment,
                approverStartSignature: warrant.approver_start_signature,
                wage: warrant.wage,
                wagesTotal: warrant.wages_total,
                routesTotal: warrant.routes_total,
                otherTotal: warrant.other_total,
                allTotal: warrant.all_total,
                report: warrant.report,
                applicantSignature: warrant.applicant_signature,
                accountantSignature: warrant.accountant_signature,
                approverSignature: warrant.approver_signature
            };
            for (var i = 0; i < helperService.getNumberOfRoutes(warrant); i++) {
                data['routesFrom' + i] = warrant['routes_from_' + i];
                data['routesTo' + i] = warrant['routes_to_' + i];
                data['routesTransportation' + i] = warrant['routes_transportation_' + i];
                data['routesCost' + i] = warrant['routes_cost_' + i];
            }
            for (i = 0; i < helperService.getNumberOfOther(warrant); i++) {
                data['otherDescription' + i] = warrant['other_description_' + i];
                data['otherCost' + i] = warrant['other_cost_' + i];
            }

            return data;
        }

        function downloadAttachment(name) {
            var iframe = angular.element(document.querySelector('iframe.attachments-frame'));
            iframe.attr('src', 'api/v1/warrants/' + vm.warrants[vm.current].id + '/attachments/' + name);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main', ['requests', 'warrants']);
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
            })
            .state('main.new-user', {
                url: '/new-user',
                templateUrl: 'app/main/new-user/new-user.html',
                controller: 'NewUserCtrl as newUser'
            })
            .state('main.pending-warrants', {
                url: '/pending-warrants',
                templateUrl: 'app/main/pending-warrants/pending-warrants.html',
                controller: 'PendingWarrantsCtrl as pendingWarrants',
                resolve: {
                    warrants: function(apiService) {
                        return apiService.getWarrants('user/pending');
                    }
                }
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
                name: 'main.requests.validation',
                label: 'Validacija zahtjeva',
                icon: 'library_books',
                type: [1]
            },
            {
                name: 'main.requests.approval',
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
            },
            {
                name: 'main.warrants.validation',
                label: 'Putni nalozi',
                icon: 'library_books',
                type: [1]
            },
            {
                name: 'main.warrants.accounting',
                label: 'Putni nalozi',
                icon: 'library_books',
                type: [3]
            },
            {
                name: 'main.warrants.approval',
                label: 'Putni nalozi',
                icon: 'library_books',
                type: [2]
            },
            {
                name: 'main.warrants.sent',
                label: 'Poslani putni nalozi',
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
        .controller('NewUserCtrl', NewUserCtrl);

    NewUserCtrl.$inject = ['$scope', '$state', 'apiService'];
    function NewUserCtrl($scope, $state, apiService) {
        if ($scope['main'].user.type != 4) return $state.go('main.home');

        var vm = this;

        vm.clear = clear;
        vm.createUser = createUser;

        function clear() {
            vm.type = null;
            vm.name = null;
            vm.surname = null;
            vm.email = null;
            vm.password = null;
        }

        function createUser() {
            var data = {
                type: vm.type,
                name: vm.name,
                surname: vm.surname,
                email: vm.email,
                password: vm.password
            };

            apiService.createUser(data);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('PendingWarrantsCtrl', PendingWarrantsCtrl);

    PendingWarrantsCtrl.$inject = ['$scope', 'warrants', 'helperService', 'apiService', 'dialogService', '$mdDialog', 'toastService'];
    function PendingWarrantsCtrl($scope, warrants, helperService, apiService, dialogService, $mdDialog, toastService) {
        var vm = this;

        vm.warrants = warrants;
        vm.current = null;
        vm.numOfWages = null;
        vm.wagesTotal = null;
        vm.numOfRoutes = null;
        vm.routesTotal = null;
        vm.numOfOther = null;
        vm.otherTotal = null;
        vm.allTotal = null;
        vm.attachments = null;

        vm.formatDate = helperService.formatDate;
        vm.selectWarrant = selectWarrant;
        vm.updateWagesTotal = updateWagesTotal;
        vm.addRoute = addRoute;
        vm.removeRoute = removeRoute;
        vm.updateRoutesTotal = updateRoutesTotal;
        vm.addOther = addOther;
        vm.removeOther = removeOther;
        vm.updateOtherTotal = updateOtherTotal;
        vm.removeAttachments = removeAttachments;
        vm.sign = sign;
        vm.save = save;
        vm.showDocumentDialog = showDocumentDialog;

        init();

        function init() {
            if (vm.warrants.length > 0) {
                vm.current = 0;
                selectWarrant(0);
            }
        }

        function selectWarrant(index) {
            vm.current = index;

            var warrant = warrants[vm.current];

            vm.wage = warrant.wage;
            vm.numOfWages = helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp);
            vm.wagesTotal = warrant.wages_total == null ? 0 : warrant.wages_total;

            vm.numOfRoutes = helperService.getNumberOfRoutes(warrant);
            for (var i = 0; i < vm.numOfRoutes; i++) {
                vm['routesFrom' + i] = warrant['routes_from_' + i];
                vm['routesTo' + i] = warrant['routes_to_' + i];
                vm['routesTransportation' + i] = warrant['routes_transportation_' + i];
                vm['routesCost' + i] = warrant['routes_cost_' + i];
            }
            vm.routesTotal = warrant.routes_total == null ? 0 : warrant.routes_total;

            vm.numOfOther = helperService.getNumberOfOther(warrant);
            for (i = 0; i < vm.numOfOther; i++) {
                vm['otherDescription' + i] = warrant['other_description_' + i];
                vm['otherCost' + i] = warrant['other_cost_' + i];
            }
            vm.otherTotal = warrant.other_total == null ? 0 : warrant.other_total;

            vm.allTotal = warrant.all_total == null ? 0 : warrant.all_total;
            vm.report = warrant.report;

            apiService.getAttachments(warrant.id).then(function(attachments) {
                vm.attachments = attachments.length == 0 ? null : attachments;
            });

            vm.applicantSignature = warrant.applicant_signature;
        }

        function updateWagesTotal() {
            vm.wagesTotal = vm.wage * vm.numOfWages;
            updateAllTotal();
        }

        function addRoute() {
            vm.numOfRoutes++;
        }

        function removeRoute() {
            var i = --vm.numOfRoutes;
            vm['routesFrom' + i] = null;
            vm['routesTo' + i] = null;
            vm['routesTransportation' + i] = null;
            vm['routesCost' + i] = null;
        }

        function updateRoutesTotal() {
            vm.routesTotal = 0;
            for (var i = 0; i < vm.numOfRoutes; i++) {
                if (vm['routesCost' + i]) vm.routesTotal += vm['routesCost' + i];
            }
            updateAllTotal();
        }

        function addOther() {
            vm.numOfOther++;
        }

        function removeOther() {
            var i = --vm.numOfOther;
            vm['otherDescription' + i] = null;
            vm['otherCost' + i] = null;
            if (vm.numOfOther == 0) vm.otherTotal = 0;
        }

        function updateOtherTotal() {
            vm.otherTotal = 0;
            for (var i = 0; i < vm.numOfOther; i++) {
                if (vm['otherCost' + i]) vm.otherTotal += vm['otherCost' + i];
            }
            updateAllTotal();
        }

        function updateAllTotal() {
            vm.allTotal = vm.wagesTotal + vm.routesTotal + vm.otherTotal;
        }

        function removeAttachments() {
            vm.attachments = null;
        }

        function sign($event) {
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'w', null, 0);
            $mdDialog.show(signatureDialogObject);
        }

        function save() {
            var warrantId = warrants[vm.current].id;
            var data = {
                wage: vm.wage,
                wages_total: vm.wagesTotal,
                routes_total: vm.routesTotal,
                other_total: vm.otherTotal,
                all_total: vm.allTotal,
                report: vm.report,
                applicant_signature: vm.applicantSignature
            };
            for (var i = 0; i < 7; i++) {
                data['routes_from_' + i] = !vm['routesFrom' + i] ? null : vm['routesFrom' + i];
                data['routes_to_' + i] = !vm['routesTo' + i] ? null : vm['routesTo' + i];
                data['routes_transportation_' + i] = !vm['routesTransportation' + i] ? null : vm['routesTransportation' + i];
                data['routes_cost_' + i] = !vm['routesCost' + i] ? null : vm['routesCost' + i];
            }
            for (i = 0; i < 4; i++) {
                data['other_description_' + i] = !vm['otherDescription' + i] ? null : vm['otherDescription' + i];
                data['other_cost_' + i] = !vm['otherCost' + i] ? null : vm['otherCost' + i];
            }

            if (vm.attachments) {
                if (!helperService.areFilesExtensionsValid(vm.attachments)) {
                    vm.attachments = null;
                    toastService.show("Odabrani neprihvatljivi tipovi datoteka! Prihvatljivi tipovi datoteka su .pdf, .png, .jpg, .jpeg.", 6000);
                } else if (!helperService.isFilesArrayUnderMaxSize(vm.attachments)) {
                    vm.attachments = null;
                    toastService.show("Odabrane datoteke zauzimaju previše memorije! Skup odabranih datoteka mora zauzimati manje od 10 MB.", 6000);
                } else {
                    apiService.postAttachments(warrantId, vm.attachments);
                    apiService.updateWarrant(warrantId, data, "Putni nalog spremljen!", false);

                }
            } else {
                apiService.deleteAttachments(warrantId);
                apiService.updateWarrant(warrantId, data, "Putni nalog spremljen!", false);
            }
        }

        function showDocumentDialog($event) {
            var warrant = warrants[vm.current];
            var data = {
                warrantId: warrant.id,
                mark: warrant.mark,
                type: warrant.type,
                documentDate: helperService.formatDate(warrant.document_date, 'dd.MM.yyyy.'),
                name: warrant.name,
                surname: warrant.surname,
                workplace: warrant.workplace,
                startDate: helperService.formatDate(warrant.start_timestamp, 'dd.MM.yyyy.'),
                forPlace: warrant.for_place,
                description: warrant.description,
                startTimestamp: helperService.formatDate(warrant.start_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                endTimestamp: helperService.formatDate(warrant.end_timestamp, "dd.MM.yyyy. 'u' HH:mm"),
                durationDays: helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp),
                transportation: warrant.transportation,
                expensesResponsible: warrant.expenses_responsible,
                advancePayment: warrant.advance_payment,
                approverStartSignature: warrant.approver_start_signature,
                wage: vm.wage,
                wagesTotal: vm.wagesTotal,
                numOfRoutes: vm.numOfRoutes,
                routesTotal: vm.routesTotal,
                numOfOther: vm.numOfOther,
                otherTotal: vm.otherTotal,
                allTotal: vm.allTotal,
                report: vm.report,
                attachments: vm.attachments,
                applicantSignature: vm.applicantSignature
            };
            for (var i = 0; i < vm.numOfRoutes; i++) {
                data['routesFrom' + i] = vm['routesFrom' + i];
                data['routesTo' + i] = vm['routesTo' + i];
                data['routesTransportation' + i] = vm['routesTransportation' + i];
                data['routesCost' + i] = vm['routesCost' + i];
            }
            for (i = 0; i < vm.numOfOther; i++) {
                data['otherDescription' + i] = vm['otherDescription' + i];
                data['otherCost' + i] = vm['otherCost' + i];
            }

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
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

        vm.name = $scope['main'].user.name;
        vm.surname = $scope['main'].user.surname;

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
                projectLeader: vm.projectLeader,
                startTimestamp: vm.startTimestamp,
                endTimestamp: vm.endTimestamp,
                startTimestampRaw: vm.startTimestampRaw,
                endTimestampRaw: vm.endTimestampRaw,
                duration: helperService.getDuration(vm.startTimestampRaw, vm.endTimestampRaw),
                advancePayment: vm.advancePayment,
                description: vm.description,
                transportation: helperService.formatTransportation(vm.transportation),
                expensesResponsible: vm.expensesResponsible,
                expensesExplanation: vm.expensesExplanation,
                applicantSignature: vm.applicantSignature
            };

            var documentDialogObject = dialogService.getDocumentDialogObject($event, data);
            $mdDialog.show(documentDialogObject);
        }

        function sign($event) {
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'r', null, 0);
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
            vm.projectLeader = null;
            vm.advancePayment = null;
            vm.startTimestamp = null;
            vm.endTimestamp = null;
            vm.startTimestampRaw = null;
            vm.endTimestampRaw = null;
            vm.advancePayment = null;
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

    DetailsDialogCtrl.$inject = ['doc', '$mdDialog', 'helperService'];
    function DetailsDialogCtrl(doc, $mdDialog, helperService) {
        var vm = this;

        vm.hide = hide;

        vm.getCreationInfo = getCreationInfo;
        vm.getMainInfo = getMainInfo;
        vm.getReason = getReason;

        function hide() {
            $mdDialog.hide();
        }

        function getCreationInfo() {
            if (!doc.report) {
                return "Zahtjev je poslan " + helperService.formatDate(doc.created_at, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else {
                return "Putni nalog je poslan " + helperService.formatDate(doc.sent, "dd.MM.yyyy. 'u' HH:mm") + ".";
            }
        }

        function getMainInfo() {
            var docType = (!doc.report ? "Zahtjev" : "Putni nalog");
            if (doc.quality_check == null) {
                return "Provjera ispravnosti još nije izvršena."
            } else if (doc.quality_check == false) {
                return docType + " je ocijenjen neispravnim " + helperService.formatDate(doc.quality_check_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (doc.approved) {
                return docType + " je odobren " + helperService.formatDate(doc.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else if (doc.accounting_check == false || doc.approved == false) {
                return docType + " je odbijen " + helperService.formatDate(doc.approved_timestamp, "dd.MM.yyyy. 'u' HH:mm") + ".";
            } else {
                return docType + " je ispravan i čeka odobrenje.";
            }
        }

        function getReason() {
            if (doc.invalidity_reason != null) {
                return doc.invalidity_reason;
            } else if (doc.accounting_reason != null) {
                return doc.accounting_reason;
            } else if (doc.disapproval_reason != null) {
                return doc.disapproval_reason;
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

    DocumentDialogCtrl.$inject = ['$mdDialog', 'documentService', '$document', 'data', 'helperService', 'apiService', '$scope', 'toastService'];
    function DocumentDialogCtrl($mdDialog, documentService, $document, data, helperService, apiService, $scope, toastService) {
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
            if (!data.report) {
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
                    project_leader: data.type == 'n' ? null : data.projectLeader,
                    start_timestamp: helperService.formatDate(data.startTimestampRaw, 'yyyy-MM-dd HH:mm:ss'),
                    end_timestamp: helperService.formatDate(data.endTimestampRaw, 'yyyy-MM-dd HH:mm:ss'),
                    duration: data.duration,
                    advance_payment: data.advancePayment,
                    description: data.description,
                    transportation: data.transportation,
                    expenses_responsible: data.expensesResponsible,
                    expenses_explanation: data.expensesExplanation,
                    applicant_signature: data.applicantSignature
                };
                apiService.createRequest(newRequest);
            } else {
                var warrant = {
                    wage: data.wage,
                    wages_total: data.wagesTotal,
                    routes_total: data.routesTotal,
                    other_total: data.otherTotal,
                    all_total: data.allTotal,
                    report: data.report,
                    applicant_signature: data.applicantSignature,
                    sent: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
                };
                for (var i = 0; i < 7; i++) {
                    warrant['routes_from_' + i] = !data['routesFrom' + i] ? null : data['routesFrom' + i];
                    warrant['routes_to_' + i] = !data['routesTo' + i] ? null : data['routesTo' + i];
                    warrant['routes_transportation_' + i] = !data['routesTransportation' + i] ? null : data['routesTransportation' + i];
                    warrant['routes_cost_' + i] = !data['routesCost' + i] ? null : data['routesCost' + i];
                }
                for (i = 0; i < 4; i++) {
                    warrant['other_description_' + i] = !data['otherDescription' + i] ? null : data['otherDescription' + i];
                    warrant['other_cost_' + i] = !data['otherCost' + i] ? null : data['otherCost' + i];
                }

                if (data.attachments) {
                    if (!helperService.areFilesExtensionsValid(data.attachments)) {
                        $scope['pendingWarrants'].attachments = null;
                        toastService.show("Odabrani neprihvatljivi tipovi datoteka! Prihvatljivi tipovi datoteka su .pdf, .png, .jpg, .jpeg.", 6000);
                    } else if (!helperService.isFilesArrayUnderMaxSize(data.attachments)) {
                        $scope['pendingWarrants'].attachments = null;
                        toastService.show("Odabrane datoteke zauzimaju previše memorije! Skup odabranih datoteka mora zauzimati manje od 10 MB.", 6000);
                    } else {
                        apiService.postAttachments(data.warrantId, data.attachments);
                        apiService.updateWarrant(data.warrantId, warrant, "Putni zahtjev poslan!", true);

                    }
                } else {
                    apiService.deleteAttachments(data.warrantId);
                    apiService.updateWarrant(data.warrantId, warrant, "Putni zahtjev poslan!", true);
                }
            }

            hide();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('MarkRequestDialogCtrl', MarkRequestDialogCtrl);

    MarkRequestDialogCtrl.$inject = ['$mdDialog', 'requestId', 'apiService', 'helperService'];
    function MarkRequestDialogCtrl($mdDialog, requestId, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = {
                mark: vm.mark,
                quality_check: true,
                quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
            };
            apiService.updateRequest(requestId, data, "Zahtjev prosljeđen!", true);
            hide();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('RejectDialogCtrl', RejectDialogCtrl);

    RejectDialogCtrl.$inject = ['$mdDialog', 'docType', 'docId', 'userType', 'warrant', 'apiService', 'helperService'];
    function RejectDialogCtrl($mdDialog, docType, docId, userType, warrant, apiService, helperService) {
        var vm = this;

        vm.hide = hide;
        vm.confirm = confirm;

        switch (userType) {
            case 1:
                vm.title = "Neispravnost " + (docType == 'r' ? " zahtjeva" : " putnog naloga");
                vm.label = "Razlog neispravnosti";
                break;
            case 2:
                vm.title = "Odbijanje " + (docType == 'r' ? " zahtjeva" : " putnog naloga");
                vm.label = "Razlog odbijanja";
                break;
            case 3:
                vm.wage = warrant.wage;
                vm.numOfWages = helperService.getDurationDays(warrant.start_timestamp, warrant.end_timestamp);
                vm.wagesTotal = warrant.wages_total == null ? 0 : warrant.wages_total;

                vm.numOfRoutes = helperService.getNumberOfRoutes(warrant);
                for (var i = 0; i < vm.numOfRoutes; i++) {
                    vm['routesFrom' + i] = warrant['routes_from_' + i];
                    vm['routesTo' + i] = warrant['routes_to_' + i];
                    vm['routesTransportation' + i] = warrant['routes_transportation_' + i];
                    vm['routesCost' + i] = warrant['routes_cost_' + i];
                }
                vm.routesTotal = warrant.routes_total == null ? 0 : warrant.routes_total;

                vm.numOfOther = helperService.getNumberOfOther(warrant);
                for (i = 0; i < vm.numOfOther; i++) {
                    vm['otherDescription' + i] = warrant['other_description_' + i];
                    vm['otherCost' + i] = warrant['other_cost_' + i];
                }
                vm.otherTotal = warrant.other_total == null ? 0 : warrant.other_total;

                vm.allTotal = warrant.all_total == null ? 0 : warrant.all_total;

                vm.updateWagesTotal = updateWagesTotal;
                vm.addRoute = addRoute;
                vm.removeRoute = removeRoute;
                vm.updateRoutesTotal = updateRoutesTotal;
                vm.addOther = addOther;
                vm.removeOther = removeOther;
                vm.updateOtherTotal = updateOtherTotal;

                break;
            default:
                break;
        }

        function hide() {
            $mdDialog.hide();
        }

        function confirm() {
            var data = getDataObject();
            if (data != null) {
                if (docType == 'r') apiService.updateRequest(docId, data, "Zahtjev odbijen!", true);
                else apiService.updateWarrant(docId, data, "Putni nalog odbijen!", true);
            }
            hide();
        }

        function getDataObject() {
            switch (userType) {
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
                case 3:
                    var data = {
                        wage: vm.wage,
                        wages_total: vm.wagesTotal,
                        routes_total: vm.routesTotal,
                        other_total: vm.otherTotal,
                        all_total: vm.allTotal,

                        accounting_check: false,
                        accounting_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        accounting_reason: vm.reason
                    };

                    for (var i = 0; i < 7; i++) {
                        data['routes_from_' + i] = !vm['routesFrom' + i] ? null : vm['routesFrom' + i];
                        data['routes_to_' + i] = !vm['routesTo' + i] ? null : vm['routesTo' + i];
                        data['routes_transportation_' + i] = !vm['routesTransportation' + i] ? null : vm['routesTransportation' + i];
                        data['routes_cost_' + i] = !vm['routesCost' + i] ? null : vm['routesCost' + i];
                    }
                    for (i = 0; i < 4; i++) {
                        data['other_description_' + i] = !vm['otherDescription' + i] ? null : vm['otherDescription' + i];
                        data['other_cost_' + i] = !vm['otherCost' + i] ? null : vm['otherCost' + i];
                    }

                    return data;
                default:
                    return null;
            }
        }

        function updateWagesTotal() {
            vm.wagesTotal = vm.wage * vm.numOfWages;
            updateAllTotal();
        }

        function addRoute() {
            vm.numOfRoutes++;
        }

        function removeRoute() {
            var i = --vm.numOfRoutes;
            vm['routesFrom' + i] = null;
            vm['routesTo' + i] = null;
            vm['routesTransportation' + i] = null;
            vm['routesCost' + i] = null;
        }

        function updateRoutesTotal() {
            vm.routesTotal = 0;
            for (var i = 0; i < vm.numOfRoutes; i++) {
                if (vm['routesCost' + i]) vm.routesTotal += vm['routesCost' + i];
            }
            updateAllTotal();
        }

        function addOther() {
            vm.numOfOther++;
        }

        function removeOther() {
            var i = --vm.numOfOther;
            vm['otherDescription' + i] = null;
            vm['otherCost' + i] = null;
            if (vm.numOfOther == 0) vm.otherTotal = 0;
        }

        function updateOtherTotal() {
            vm.otherTotal = 0;
            for (var i = 0; i < vm.numOfOther; i++) {
                if (vm['otherCost' + i]) vm.otherTotal += vm['otherCost' + i];
            }
            updateAllTotal();
        }

        function updateAllTotal() {
            vm.allTotal = vm.wagesTotal + vm.routesTotal + vm.otherTotal;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('SignatureDialogCtrl', SignatureDialogCtrl);

    SignatureDialogCtrl.$inject = ['$scope', '$mdDialog', '$document', 'docType', 'docId', 'userType', 'helperService', 'apiService'];
    function SignatureDialogCtrl($scope, $mdDialog, $document, docType, docId, userType, helperService, apiService) {
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
            var data = null;
            switch (userType) {
                case 0:
                    if (docType == 'r') {
                        $scope['newRequest']['applicantSignature'] = signaturePad.toDataURL();
                    } else {
                        $scope['pendingWarrants']['applicantSignature'] = signaturePad.toDataURL();
                    }
                    break;
                case 2:
                    data = {
                        approved: true,
                        approved_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        approver_signature: signaturePad.toDataURL()
                    };

                    if (docType == 'r') apiService.updateRequest(docId, data, null, true);
                    else apiService.updateWarrant(docId, data, "Putni nalog odobren!", true);

                    break;
                case 3:
                    data = {
                        accounting_check: true,
                        accounting_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss'),
                        accountant_signature: signaturePad.toDataURL()
                    };

                    apiService.updateWarrant(docId, data, "Putni nalog odobren!", true);

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
        .controller('RequestsApprovalCtrl', RequestsApprovalCtrl);

    RequestsApprovalCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsApprovalCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 2) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za odobravanje.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'r', requestId, 2);
            $mdDialog.show(rejectDialogObject);
        }

        function approve($event) {
            var requestId = requests[$scope['requests'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'r', requestId, 2);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsValidationCtrl', RequestsValidationCtrl);

    RequestsValidationCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsValidationCtrl($scope, $state, requests, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['requests'].emptyInfo = "Nema zahtjeva za pregled.";
        $scope['requests'].requests = requests;
        $scope['requests'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'r', requestId, 1);
            $mdDialog.show(rejectDialogObject);
        }

        function valid($event) {
            var requestId = requests[$scope['requests'].current].id;
            var markRequestDialogObject = dialogService.getMarkRequestDialogObject($event, requestId);
            $mdDialog.show(markRequestDialogObject);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('requests')
        .controller('RequestsSentCtrl', RequestsSentCtrl);

    RequestsSentCtrl.$inject = ['$scope', '$state', 'requests', 'dialogService', '$mdDialog'];
    function RequestsSentCtrl($scope, $state, requests, dialogService, $mdDialog) {
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
        .module('main')
        .controller('WarrantsAccountingCtrl', WarrantsAccountingCtrl);

    WarrantsAccountingCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog'];
    function WarrantsAccountingCtrl($scope, $state, warrants, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 3) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za pregled.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var warrant = warrants[$scope['warrants'].current];
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'w', warrant.id, 3, warrant);
            $mdDialog.show(rejectDialogObject);
        }

        function approve($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'w', warrantId, 3);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('main')
        .controller('WarrantsApprovalCtrl', WarrantsApprovalCtrl);

    WarrantsApprovalCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog'];
    function WarrantsApprovalCtrl($scope, $state, warrants, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 2) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za odobravanje.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.disapprove = disapprove;
        vm.approve = approve;

        function disapprove($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'w', warrantId, 2);
            $mdDialog.show(rejectDialogObject);
        }

        function approve($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            var signatureDialogObject = dialogService.getSignatureDialogObject($scope, $event, 'w', warrantId, 2);
            $mdDialog.show(signatureDialogObject);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('warrants')
        .controller('WarrantsSentCtrl', WarrantsSentCtrl);

    WarrantsSentCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog'];
    function WarrantsSentCtrl($scope, $state, warrants, dialogService, $mdDialog) {
        if ($scope['main'].user.type != 0) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema poslanih zahtjeva.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.icon = getIcon($scope['warrants'].current);
        vm.class = getClass($scope['warrants'].current);
        vm.showDetails = showDetails;

        $scope.$watch('warrants.current', function() {
            vm.icon = getIcon($scope['warrants'].current);
            vm.class = getClass($scope['warrants'].current);
            vm.classAria = getClassAria();
        });

        function showDetails($event) {
            var detailsDialogObject = dialogService.getDetailsDialogObject($event, warrants[$scope['warrants'].current]);
            $mdDialog.show(detailsDialogObject);
        }

        function getIcon(i) {
            var warrant = $scope['warrants'].warrants[i];
            if (warrant.invalidity_reason || warrant.accounting_reason || warrant.disapproval_reason) {
                return 'thumb_down';
            } else if (warrant.approved) {
                return 'thumb_up';
            } else return 'thumbs_up_down';
        }

        function getClass(i) {
            var warrant = $scope['warrants'].warrants[i];
            if (warrant.invalidity_reason || warrant.accounting_reason || warrant.disapproval_reason) {
                return 'negative';
            } else if (warrant.approved) {
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
        .module('warrants')
        .controller('WarrantsValidationCtrl', WarrantsValidationCtrl);

    WarrantsValidationCtrl.$inject = ['$scope', '$state', 'warrants', 'dialogService', '$mdDialog', 'apiService', 'helperService'];
    function WarrantsValidationCtrl($scope, $state, warrants, dialogService, $mdDialog, apiService, helperService) {
        if ($scope['main'].user.type != 1) return $state.go('main.home');

        $scope['warrants'].emptyInfo = "Nema putnih naloga za pregled.";
        $scope['warrants'].warrants = warrants;
        $scope['warrants'].init();

        var vm = this;

        vm.invalid = invalid;
        vm.valid = valid;

        function invalid($event) {
            var warrantId = warrants[$scope['warrants'].current].id;
            var rejectDialogObject = dialogService.getRejectDialogObject($event, 'w', warrantId, 1);
            $mdDialog.show(rejectDialogObject);
        }

        function valid() {
            var warrantId = warrants[$scope['warrants'].current].id;
            var data = {
                quality_check: true,
                quality_check_timestamp: helperService.formatDate(null, 'yyyy-MM-dd HH:mm:ss')
            };
            apiService.updateWarrant(warrantId, data, "Putni nalog prosljeđen!", true);
        }
    }
})();