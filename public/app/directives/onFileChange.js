(function() {
    'use strict';

    angular
        .module('app')
        .directive('onFileChange', onFileChange);

    function onFileChange() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('change', function() {
                    var elementId = element[0].id;
                    var filePath = element[0].value;
                    var func = scope.$eval(attrs.onFileChange);
                    element.bind('change', func(elementId, filePath));
                });
            }
        }
    }
})();