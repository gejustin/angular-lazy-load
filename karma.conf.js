module.exports = function(config) {
    config.set({
        basePath: '',
        //https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon-chai'],
        files: [
          'bower_components/ng-describe/dist/ng-describe.js',
          // bower:js
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
          // endbower
          'src/lazyLoad.module.js',
          'src/**/*.js',
          'src/**/*.html',
        ],
        exclude: [
          '**/*.swp'
        ],
        plugins: [
           'karma-spec-reporter',
           'karma-mocha',
           'karma-sinon-chai',
           'karma-phantomjs-launcher',
           'karma-chrome-launcher',
           'karma-ng-html2js-preprocessor'
        ],
        preprocessors: {
            'src/**/*.html': ['ng-html2js']
        },
        reporters: ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};