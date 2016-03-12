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
                content: [
                    { text: "Sveučilište J. J. Strossmayera u Osijeku", style: 'header' },
                    { text: "Elektrotehnički fakultet", style: 'header' },
                    { text: "U Osijeku, " + data.documentDate, style: 'documentDate' },
                    { text: "Dekanu Elektrotehničkog fakulteta Osijek".toUpperCase(), style: ['title', 'titleTop'] },
                    { text: "Zahtjev za izdavanje putnog naloga".toUpperCase(), style: ['title', 'titleMiddle'] },
                    { text: "Najkasnije 7 dana prije putovanja", style: ['title', 'titleBottom'] },
                    { text: "Ime, prezime i radno mjesto:", style: 'regular' },
                    { text: data.name + " " + data.surname + ", " + data.workplace, style: 'input' },
                    { text: "Molim odobrenje službenog puta za (mjesto, fakultet, kolegij):", style: 'regular' },
                    { text: data.forPlace + ", " + data.forFaculty + ", " + data.forSubject, style: 'input' },
                    {
                        columns: [
                            { text: "Datum polaska:", style: 'regular', width: '*' },
                            { text: "Datum povratka:", style: 'regular', width: '*' },
                            { text: "Trajanje putovanja:", style: 'regular', width: '*' }
                        ]
                    },
                    {
                        columns: [
                            { text: data.startTimestamp, style: 'input', width: '*' },
                            { text: data.endTimestamp, style: 'input', width: '*' },
                            { text: data.duration, style: 'input', width: '*' }
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
                    title: {
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
                        margin: [0, 0, 0, 26]
                    },
                    regular: {
                        fontSize: 11,
                        bold: true
                    },
                    input: {
                        fontSize: 13,
                        margin: [0, 0, 0, 8]
                    }
                }
            }
        }

        function getRequestZDocument() {

        }
    }
})();