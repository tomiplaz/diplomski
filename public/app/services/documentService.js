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
                { text: "Odobrava:", style: ['regular', 'topMargin40', 'right'] },
                {
                    columns: [
                        { text: "", width: '*' },
                        { image: data.approverSignature, width: 125, height: 35 }
                    ]
                },
                { text: "(dekan: prof. dr. sc. Drago Žagar)", style: ['regular', 'right'] },

                // bill starts here

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

                // report starts here

                { text: "Izvješće".toUpperCase(), style: 'titleStandalone', pageBreak: 'before' },
                { text: data.report, style: 'inputItalics' },

                // attachments start here

                { text: "Prilozi".toUpperCase(), style: 'titleStandalone', pageBreak: 'before' },
                {
                    table: {
                        widths: ['*'],
                        body: getAttachments(data.attachments)
                    }
                }
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

        function getAttachments(dataAttachments) {
            if (dataAttachments.length == 0) {
                return { text: "Nema priloga", style: 'regular' };
            } else {
                var attachments = [];

                for (var i = 0; i < dataAttachments.length; i++) {
                    attachments.push([
                        { text: dataAttachments[i].name, style: 'inputItalics' }
                    ]);
                }

                return attachments;
            }
        }
    }
})();