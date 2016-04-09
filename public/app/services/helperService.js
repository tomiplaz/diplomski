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

            return size < 10000;
        }
    }
})();