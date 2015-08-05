module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: {
            src_dir: 'src',
            build_dir: 'release'
        },
        lib_files: {
            src: [
                '<%= config.src_dir %>/lazyLoad.module.js',
                '<%= config.src_dir %>/lazyLoad.provider.js',
                '<%= config.src_dir %>/**/*.js',
                '!bower_components/'
            ],
            tests: [
                '<%= config.src_dir %>/**/*.spec.js'
            ]
        },
        clean: {
            release: ['<%= config.build_dir%>']
        },
        concat: {
            core: {
                src: ['<%= lib_files.src %>'],
                dest: '<%= config.build_dir %>/angular-lazy-load.js'
            }
        },
        jshint: {
            ignore_warning: {
                options: {
                    '-W002': true, // IE8 and earlier issue
                    '-W044': true, // Bad / unnecessary escaping
                    '-W069': true, // dot notation,
                    '-W084': true, // expected a conditional
                    '-W061': true, // eval can be harmful
                    '-W030': true, // expected assignment for function call
                    '-W040': true, // Possible strict violation
                    asi: true // tolerate missing simicolons
                },
                src: [
                    '<%= lib_files.src %>',
                    '!<%= lib_files.tests %>'
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        uglify: {
            core: {
                files: [{
                    expand: true,
                    src: '<%= config.build_dir %>/angular-lazy-load.js',
                    ext: '.min.js'
                }],
                options: {
                    mangle: false
                }
            }
        },
        umd: {
            core: {
                src: '<%= concat.core.dest %>',
                dest: '<%= concat.core.dest %>'
            }
        },
        watch: {
            core: {
                files: '<%= lib_files.src %>',
                tasks: ['default'],
                options: {
                    interrupt: true,
                }
            }
        },
        wiredep: {
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'wiredep',
        'jshint',
        'concat',
        'umd',
        'uglify'
    ]);
    
    grunt.registerTask('test', [
        'clean',
        'wiredep',
        'jshint',
        'karma'
    ]);
};