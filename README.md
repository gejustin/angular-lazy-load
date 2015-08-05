# angular-lazy-load
**Version 1.0.0**

## Overview
AngularJS Module for lazy loading content. This module exposes custom angular directives and a service provider for loading content lazily.
The intent of this application is to simplify lazy loading html content by breaking it into the basic elements of the lazy loading process.

### The Test Function(s):
 - The test functions provided to the directive will be used to determine whether or not some piece of content is ready to be loaded.
 
### The Callback Function(s):
 - The callback functions provided to the directive will be executed whenever the test functions for the current instance return true.
 
### Event(s):
 - The event-types provided to the directive are used to re-evalute the test function again. If the initial test returns false, event listeners are set up to run the test again.
 - These can be any native events or custom events.

## Getting started with development

#### Pre-requisites
- [NodeJS & npm](http://nodejs.org/)
- [Grunt](http://gruntjs.com/getting-started)
- [Bower](http://bower.io/#install-bower)

1. Install [Node.js](http://nodejs.org)
 - on OSX use [homebrew](http://brew.sh) `brew install node`
 - on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`
 
2. Install these NPM packages globally.

    ```bash
    npm install -g bower grunt
    ```

    >Refer to these [instructions on how to not require sudo](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)
    
3. Clone this repository.
    ```bash
    git clone https://github.com/gejustin/angular-lazy-load.git
    ```
4. Change your directory to the cloned repo.
    ```bash
    cd angular-lazy-load
    ```

5. Install node packages.
    ```bash
    npm install
    ```
    
6. Install bower components.
    ```bash
    bower install
    ```
    
7. Write Code.

8. Package for deployment.
    ```bash
    grunt
    ```

## Using it in your project

#### You must have node and bower installed.

1. Install this package via [Bower](http://bower.io/#install-bower).

2. Load the script into your angular js application.
 
    >Supports CommonJS and AMD Module loaders.
 
3. Add this module to your application.
    ```javascript
    angular.module('your.module', ['garyjustin.lazyLoad']);
    ```

## Provider Methods

#### Configure your test and callback caches.
During the configuration phase of your angular application, you can setup application wide test and callback caches using the
`lazyLoadProvider`. These methods return the provider and are chainable.

`disableLazyLoading()` - Calling this method on the provider will prevent all test functions and events and immediately fire all callbacks immediately.

`setCallbacksCache(cache)` - Configure an application wide callback function cache. These callbacks can be referenced in the directive or service by the property name on the cache object.

`setTestsCache(cache)` - Configure an application wide test function cache. These callbacks can be referenced in the directive or service by the property name on the cache object.

```JavaScript
angular.module('your.module)
    .config(['lazyLoadProvider', function(lazyLoadProvider){
        lazyLoadProvider
            .setTestsCache({
                IS_ACTIVE: function (element, params, options) {
                    return element.classList.contains('active');
                }
            })
            .setCallbacksCache({
                LAZY_IMAGE: function (element, params, options) {
                    element.setAttribute('src', element.getAttribute('data-src')); 
                }
            })
    }]);
```

## Directive Info
This directive creates new scope.

This directive executes at priority level 0.

### Options:

`test-cache` - {String} Space separated list of identifiers for functions defined in the testsCache.

`callback-cache` - {String} Space separated list of identifiers for functions defined in the callbacksCache.

`event-types` - {String} Space separated list of native or custom events to use if the initial evaluation of the test function(s) fails.

`force-event` - {Boolean} If true, the service will bypass the initial test evaluation and add the event listeners.

`event-delay` - {Number} Time in milliseconds to wait after events before calling the handlers (debounce).

`params` - {Object} Object of custom parameters passed to all test and calback functions.

```html
<!-- using attribute directives -->
<ANY lazy-load 
     test-cache="MY_TEST_FN" 
     callback-cache="MY_CALLBACK_FN"
     event-types="scroll keyup customEvent"
     force-event="someBoolean"
     event-delay="500"
     params="{ 'param1': value }">
 </ANY>

<!-- or by using element directives -->
<lazy-load callback-cache="MY_CALLBACK_FN" event-types="scroll" params="{ 'param1': value }">
    <ANY>Some content to be lazy loaded.</ANY>
 </lazy-load>
```

>When used as an element, the directive automatically adds a callback function that will append the transcluded content to the DOM.

## Using it as a service
You can also use the functionality as a standalone service in your own custom directive or javascript by calling the `lazyLoad` method.

### lazyLoad(element, params, options):
`element` - {Object} standard HTMLElement returned by native methods like `getElementById`.

`params` - {Object} custom dictionary of parameters to be passed to all test and callback functions.

`options` - {Object} options object to override default settings.

```JavaScript
angular.module('your.module)
    .controller(['lazyLoad'], function(lazyLoad){
        
        lazyLoad.lazyLoad(document.getElementById('someId'), {
            param1: 'value',
            param2: 23
        }, {
            //array of function objects or object key of a function in your testCache
            tests: [myTestFn, 'TEST_FROM_CACHE'],
            //array of function objects or object key of a function in your callbackCache
            callbacks: [callbackFn, 'CB_FROM_CACHE', function(){ /* some anonymous function */ }],
            //array of event names
            eventTypes: ['scroll', 'touchmove'],
            forceEvent: false,
            eventDelay: 250
        }):
    })
``` 
