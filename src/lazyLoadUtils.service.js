/**
 * @ngdoc service
 * @name lazyLoadUtils
 * @module garyjustin.lazyLoad
 *
 * @description
 * `lazyLoadUtils` provides utility functions for use throughout the lazy load module.
 */
function lazyLoadUtilsService($window) {
    /**
     * @ngdoc method
     * @name lazyLoadUtils#debounce
     * 
     * @description
     * Creates and returns a new debounced version of the passed function that will postpone its execution.
     * 
     * Borrowed this version from the site linked below.
     * 
     * @link http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
     * 
     * @param {function} func Function to execute.
     * @param {number}   wait How long to postpone execute.
     * 
     * @returns {function} Debounced version of the original function.
     */
    function debounce(func, wait) {
        var timeout, args, context, timestamp;
        return function() {
            context = this;
            args = [].slice.call(arguments, 0);
            timestamp = new Date();

            var later = function() {
                var last = (new Date()) - timestamp;

                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    func.apply(context, args);
                }
            };

            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
        };
    }

    /**
     * @ngdoc method
     * @name lazyLoadUtils#parseAttributeToArray
     * 
     * @description
     * Utility function that ensures that values given to the lazy load method are in the correct format. 
     * 
     * @param {string|array} value Value to parse.
     * 
     * @returns {array} 
     */
    function parseAttributeToArray(value) {
        var result = [];
        if ($window.angular.isString(value)) {
            result = value.split(' ').filter(function (s) { return !!s; });
        } else if ($window.angular.isArray(value)) {
            result = value;
        }
        return result;
    }

    /**
     * @ngdoc method
     * @name lazyLoadUtils#validateOptions
     * 
     * @description
     * Ensures that options passed to the lazy load method doesn't contain undefined or empty values.
     * 
     * This will strip away bad values and allow for the default settings to take their place.
     * 
     * @param {object} options Lazy load options object.
     * 
     * @returns {object}
     */
    function validateOptions(options) {
        $window.angular.forEach(options, function (value, key) {
            if (!options[key] || ($window.angular.isArray(options[key]) && options[key].length === 0)) {
                delete options[key];
            }
        });
        return options;
    }

    return {
        debounce: debounce,
        parseAttributeToArray: parseAttributeToArray,
        validateOptions: validateOptions
    };
}

window.angular.module('garyjustin.lazyLoad')
    .service('lazyLoadUtils', ['$window', lazyLoadUtilsService]);