/**
 * @ngdoc directive
 * @name lazyLoad
 * @module garyjustin.lazyLoad.lazyLoad
 *
 * @restrict E
 *
 * @description
 * `<lazy-load>` is the parent of any element.
 *
 * Transcluded content within the lazy-load element will be appended to the DOM in addition to callback other callback functions provided.
 * It should be noted that the element passed to the test and callback functions is the lazy-load element, not any of it's children.
 *
 * @param test-cache {string@} Space separated list of identifiers for functions defined in the testsCache.
 * @param callback-cache {string@} Space separated list of identifiers for functions defined in the callbacksCache.
 * @param event-types {string@} Space separated list of native or custom events to use if the initial evaluation of the test function(s) fails.
 * @param force-event {boolean@} If true, the service will bypass the initial test evaluation and add the event listeners.
 * @param event-delay {number@} Time in milliseconds to wait after events before calling the handlers (debounce).
 * @param params {object=} Object of custom parameters passed to all test and calback functions.
 * 
 * @usage
 * <hljs lang="html">
 *     <lazy-load callback-cache="MY_CALLBACK_FN" event-types="scroll" params="{ 'param1': value }">
 *         <ANY>Some content to be lazy loaded.</ANY>
 *     </lazy-load>
 * </hljs>
 */
function LazyLoadDirectiveElement($window, lazyLoad, lazyLoadUtils) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            testCache: '@',
            callbackCache: '@',
            eventTypes: '@',
            forceEvent: '@',
            eventDelay: '@',
            params: '='
        },
        compile: function (tElement, tAttributes) {
            return {
                pre: function (scope, iElement, iAttributes, controller, transcludeFn) {
                    lazyLoad.lazyLoad(iElement[0], scope.params, {
                        tests: lazyLoadUtils.parseAttributeToArray(scope.testCache),
                        callbacks: lazyLoadUtils.parseAttributeToArray(scope.callbackCache).concat([function () {
                            iElement.append(transcludeFn());
                        }]),
                        eventTypes: lazyLoadUtils.parseAttributeToArray(scope.eventTypes),
                        forceEvent: scope.forceEvent,
                        eventDelay: $window.parseInt(scope.eventDelay)
                    });
                },
            };
        }
    };
}

/**
 * @ngdoc directive
 * @name lazyLoad
 * @module garyjustin.lazyLoad.lazyLoad
 *
 * @restrict A
 *
 * @description
 * `lazy-load` can also be used as an attribute on any HTMLElement.
 *
 * When used as an attribute, the test and callback functions receive the element with the `lazy-load` attribute as it's first argument.
 * Unlike the element version of lazy-load, when used as an attribute, content contained within the element will not be appended to the DOM.
 * 
 * @param test-cache {string@} Space separated list of identifiers for functions defined in the testsCache.
 * @param callback-cache {string@} Space separated list of identifiers for functions defined in the callbacksCache.
 * @param event-types {string@} Space separated list of native or custom events to use if the initial evaluation of the test function(s) fails.
 * @param force-event {boolean@} If true, the service will bypass the initial test evaluation and add the event listeners.
 * @param event-delay {number@} Time in milliseconds to wait after events before calling the handlers (debounce).
 * @param params {object=} Object of custom parameters passed to all test and calback functions.
 * 
 * @usage
 * <hljs lang="html">
 *     <ANY lazy-load 
 *         test-cache="MY_TEST_FN" 
 *         callback-cache="MY_CALLBACK_FN"
 *         event-types="scroll keyup customEvent"
 *         force-event="someBoolean"
 *         event-delay="500"
 *         params="{ 'param1': value }">
 *     </ANY>
 * </hljs>
 */
function LazyLoadDirectiveAttribute($window, lazyLoad, lazyLoadUtils) {
    return {
        restrict: 'A',
        scope: {
            testCache: '@',
            callbackCache: '@',
            eventTypes: '@',
            forceEvent: '@',
            eventDelay: '@',
            params: '='
        },
        compile: function (tElement, tAttributes) {
            return {
                pre: function (scope, iElement, iAttributes) {
                    lazyLoad.lazyLoad(iElement[0], scope.params, {
                        tests: lazyLoadUtils.parseAttributeToArray(scope.testCache),
                        callbacks: lazyLoadUtils.parseAttributeToArray(scope.callbackCache),
                        eventTypes: lazyLoadUtils.parseAttributeToArray(scope.eventTypes),
                        forceEvent: scope.forceEvent,
                        eventDelay: $window.parseInt(scope.eventDelay)
                    });
                },
            };
        }
    };
}

window.angular.module('garyjustin.lazyLoad')
    .directive('lazyLoad', ['$window', 'lazyLoad', 'lazyLoadUtils', LazyLoadDirectiveElement])
    .directive('lazyLoad', ['$window', 'lazyLoad', 'lazyLoadUtils', LazyLoadDirectiveAttribute]);