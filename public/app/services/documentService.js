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