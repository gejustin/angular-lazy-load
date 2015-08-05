'use strict';

module('garyjustin.lazyLoad');
ngDescribe({
    name: 'Service: lazyLoad',
    modules: 'garyjustin.lazyLoad',
    inject: ['$window', 'lazyLoad', '$rootScope', '$timeout'],
    mocks: {
        ng: {
            $timeout: function(fn) {
                fn();
            },
            $window: angular.extend({}, $window, {
                addEventListener: function() {
                },
                removeEventListener: function() {
                }
            })
        }
    },
    tests: function(deps) {
        it('should pass', function() {
            'hello'.should.be.a('String');
        });

        it('should expose a lazyLoad function', function() {
            deps.lazyLoad.lazyLoad.should.be.a('function');
        });

        describe('#lazyLoad', function() {
            var mockOptions;
            beforeEach(function() {
                mockOptions = {
                    testFn: function() {
                        return true;
                    },
                    callbackFn: function() {
                    }
                };
                sinon.spy(mockOptions, 'testFn');
                sinon.spy(mockOptions, 'callbackFn');
            });

            it('should fire the callback if the initial test passes', function() {
                deps.lazyLoad.lazyLoad(null, {}, {
                    tests: [mockOptions.testFn],
                    callbacks: [mockOptions.callbackFn]
                });

                mockOptions.testFn.should.have.been.called;
                mockOptions.callbackFn.should.have.been.called;
            });
        });
    }
});