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
                {
                    columns: [
                        { text: "Molim odobrenje službenog puta za (mjesto):", style: ['regular', 'topMargin20'], width: '60%' },
                        { text: "Voditelj projekta:", style: ['regular', 'topMargin20'], width: '*' }
                    ]
                },
                {
                    columns: [
                        { text: data.forPlace, style: 'input', width: '60%' },
                        { text: data.projectLeader, style: 'input', width: '*' }
                    ]
                }
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
                { text: "Svrha (" + getTypeFull(data.type) + "):", style: ['regular', 'topMargin20'] },
                { text: data.description, style: 'input' },
                {
                    columns: [
                        { text: "Akontacija:", style: ['regular', 'topMargin20'], width: '20%' },
                        { text: "Vrsta prijevoza:", style: ['regular', 'topMargin20'], width: '*' }
                    ]
                },
                {
                    columns: [
                        { text: data.advancePayment + " kn", style: 'input', width: '20%' },
                        { text: data.transportation, style: 'input', width: '*' }
                    ]
                },
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

        function getTypeFull(type) {
            switch (type) {
                case 'n':
                    return "nastavna aktivnost";
                case 'z':
                    return "znanstvena aktivnost";
                case 's':
                    return 'stručna aktivnost';
            }
        }
    }
})();