/**
 * @ngdoc service
 * @name lazyLoad
 * @module garyjustin.lazyLoad
 *
 * @description
 * `lazyLoad` service exposes the core functional compontent of the module allowing it to be used
 * in any part of the angular application.
 * 
 * @usage
 * <hljs lang="js">
 * angular.module('your.module)
 *      .controller(['lazyLoad'], function(lazyLoad){ 
 *          lazyLoad.lazyLoad(document.getElementById('someId'), {
 *              param1: 'value',
 *              param2: 23
 *          }, {
 *              //array of function objects or object key of a function in your testCache
 *              tests: [myTestFn, 'TEST_FROM_CACHE'],
 *              //array of function objects or object key of a function in your callbackCache
 *              callbacks: [callbackFn, 'CB_FROM_CACHE', function(){ console.log('does some callback stuff'); }],
 *              //array of event names
 *              eventTypes: ['scroll', 'touchmove'],
 *              forceEvent: false,
 *              eventDelay: 250
 *          }):
 *      })
 * </hljs>
 */

/**
 * @ngdoc service
 * @name lazyLoadProvider
 * @module garyjustin.lazyLoad
 *
 * @description
 * `lazyLoadProvider` 
 * 
 * @usage
 * <hljs lang="js">
 *   angular.module('your.module')
 *      .config(['lazyLoadProvider', function(lazyLoadProvider){
 *          lazyLoadProvider
 *              .setTestsCache({
 *                  IS_ACTIVE: function (element, params, options) {
 *                      return element.classList.contains('active');
 *                  }
 *              })
 *              .setCallbacksCache({
 *                  LAZY_IMAGE: function (element, params, options) {
 *                      element.setAttribute('src', element.getAttribute('data-src')); 
 *                  }
 *              })
 *      }]);
 * </hljs>
 */
function LazyLoadProvider() {
    var callbacksCache = {
        /**
         * Empty default callback.
         * 
         * @return {undefined}
         */
        EMPTY: function () { }
    };
    var testsCache = {
        /**
         * Determine if the element is visible in the viewport.
         *
         * @param {object} element HTMLElement the lazy load function is being applied to.
         * @param {object} params  Custom dictionary of parameters.
         * @param {object} options Lazy load options object.
         *
         * @return {boolean}
         */
        IN_VIEW: function (element, params, options) {
            var bounds = element.getBoundingClientRect();

            /**
             * Determine if the element is visible based on the height of the viewport.
             *
             * @param {number} offset
             *
             * @return {boolean}
             */
            function isVerticallyVisible(offset) {
                return bounds.top + offset < window.innerHeight && bounds.bottom > 0;
            }

            /**
             * Determine if the element is visible based on the width of the viewport.
             *
             * @param {number} offset
             *
             * @return {boolean}
             */
            function isHorizontallyVisible(offset) {
                return (bounds.left + offset) < window.innerWidth && (bounds.right - offset) > 0;
            }

            return isVerticallyVisible(-100) && isHorizontallyVisible(-3 * window.innerWidth);
        }
    };
    var disabled = false;

    /**
     * @ngdoc method
     * @name lazyLoadProvider#setTestsCache
     * 
     * @description
     * Extends the default testsCache with a custom cache object.
     * 
     * @param {object} Dictionary of key, function pairs.
     * 
     * @returns {object}
     */
    function setTestsCache(cache) {
        testsCache = window.angular.extend({}, testsCache, validateCache(cache));
        return this;
    }

    /**
     * @ngdoc method
     * @name lazyLoadProvider#setCallbacksCache
     * 
     * @description
     * Extends the default callbacksCache with a custom cache object.
     * 
     * @param {object} Dictionary of key, function pairs.
     * 
     * @returns {object}
     */
    function setCallbacksCache(cache) {
        callbacksCache = window.angular.extend({}, callbacksCache, validateCache(cache));
        return this;
    }

    /**
     * @ngdoc method
     * @name lazyLoadProvider#disableLazyLoading
     * 
     * @description
     * Sets the disabled flag.
     * 
     * Setting the disabled flag to true will cause the lazy load function to immediately invoke all callbacks.
     * No test functions will be run and no events will be added.
     * 
     * @returns {object}
     */
    function disableLazyLoading() {
        disabled = true;
        return this;
    }

    /**
     * @ngdoc method
     * @name lazyLoadProvider#setCallbacksCache
     * 
     * @description
     * Extends the default callbacksCache with a custom cache object.
     * 
     * @param {object} Dictionary of key, function pairs.
     * 
     * @returns {object}
     */
    function validateCache(cache) {
        if (!window.angular.isObject(cache)) {
            throw 'Function cache must be an object.';
        }

        window.angular.forEach(cache, function (fn, alias) {
            if (!window.angular.isFunction(fn)) {
                throw 'Invalid argument for ' + alias + '. ' + fn + ' is not a function.';
            }
        });
        return cache;
    }

    return {
        disableLazyLoading: disableLazyLoading,
        setCallbacksCache: setCallbacksCache,
        setTestsCache: setTestsCache,
        $get: ['$window', '$timeout', 'lazyLoadUtils', function ($window, $timeout, lazyLoadUtils) {
            return {
                /**
                 * @ngdoc method
                 * @name lazyLoad#lazyLoad
                 * 
                 * @description
                 * Lazy load an element based on a test condition(is this ready to be loaded?)
                 *
                 * Fires a test function that determines whether or not the element should be loaded, if the test passes, fire the callback.
                 * If the test fails, attach an event listener that will trigger the test function to be checked again. Callback will fire whenever it returns true.
                 * 
                 * @param {object} element HTMLElement to lazy load.
                 * @param {object} params  Dictionary of custom params to pass to test and callback functions.
                 * @param {object} options Overrides default values (default callback does nothing, you should always override it).
                 * 
                 * @returns {object}
                 */
                lazyLoad: function (element, params, options) {
                    /**
                     * Provides default implementations for the lazy load settings.
                     *
                     * Default test functions is an array with a function that determines whether or not the element is visible in the viewport.
                     * Default eventTypes are setup to handle vertical scrolling.
                     * Default callback is an array with an empty function.
                     * Default forceEvent is set to false. We will run the initial tests.
                     * Default eventDelay is set to 0 milliseconds.
                     */
                    var defaults = {
                        tests: [testsCache.IN_VIEW],
                        eventTypes: ['scroll'],
                        callbacks: [callbacksCache.EMPTY],
                        forceEvent: false,
                        eventDelay: 0
                    };
                    var settings = $window.angular.extend($window.angular.copy(defaults), lazyLoadUtils.validateOptions(options));
                    var eventObj;
                    var args = arguments;

                    /**
                     * @ngdoc method
                     * @name lazyLoad#executeCallbacks
                     * 
                     * @description
                     * Executes supplied callback functions.
                     *
                     * Loops through all of the callbacks in the settings object. If the callback is a string, we will get the
                     * function from the callbacksCache.
                     * Each function is wrapped in the angular $timeout function in order to add it to the next digest cycle.
                     *
                     * @returns {undefined}
                     */
                    function executeCallbacks() {
                        settings.callbacks.forEach(function (fn) {
                            if ($window.angular.isFunction(fn)) {
                                fn = fn;
                            } else if ($window.angular.isString(fn) && $window.angular.isFunction(callbacksCache[fn])) {
                                fn = callbacksCache[fn];
                            } else {
                                throw 'Callback function: ' + fn + ' is not defined.';
                            }

                            $timeout(function () {
                                fn.apply(element, args);
                            });
                        });
                    }

                    /**
                     * @ngdoc method
                     * @name lazyLoad#runTests
                     * 
                     * @description
                     * Executes supplied test functions.
                     *
                     * Loops through all of the tests in the settings object. If the test is a string, we will get the
                     * function from the testsCache.
                     *
                     * @returns {boolean}
                     */
                    function runTests() {
                        return settings.tests.some(function (fn) {
                            if ($window.angular.isString(fn) && $window.angular.isFunction(testsCache[fn])) {
                                fn = testsCache[fn];
                            }
                            return $window.angular.isFunction(fn) && fn.apply(element, args);
                        });
                    }

                    /**
                     * @ngdoc method
                     * @name lazyLoad#updateEvents
                     * 
                     * @description
                     * Adds and removes event listeners.
                     *
                     * Loops through all of the eventTypes in the settings object and uses the provided add/remove event listener function.
                     *
                     * @returns {undefined}
                     */
                    function updateEvents(fn) {
                        settings.eventTypes.forEach(function (eventType) {
                            fn(eventType, eventObj, false);
                        });
                    }

                    // If the test passes the first time, we'll run the callback.
                    if ((!settings.forceEvent && runTests()) || disabled) {
                        executeCallbacks();
                        //If the test fails, we'll add an event listener to try again when that event first.
                    } else {
                        eventObj = {
                            handleEvent: lazyLoadUtils.debounce(function () {
                                if (runTests()) {
                                    executeCallbacks();
                                    this.removeEvent();
                                }
                            }, settings.eventDelay),
                            removeEvent: function () {
                                updateEvents($window.removeEventListener);
                            }
                        };
                        updateEvents($window.addEventListener);
                    }
                }
            };
        }]
    };
}

window.angular.module('garyjustin.lazyLoad')
    .provider('lazyLoad', [LazyLoadProvider]);
