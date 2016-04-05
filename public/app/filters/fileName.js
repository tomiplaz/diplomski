(function() {
    'use strict';

    angular
        .module('app')
        .filter('fileName', fileName);

    function fileName() {
        return function(filePath) {
            return filePath.replace(/^.*[\\\/]/, '');
        }
    }
})();