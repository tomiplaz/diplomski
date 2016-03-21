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