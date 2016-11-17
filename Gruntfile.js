'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    paths: {
      // configurable paths
      app: 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= paths.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= paths.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= paths.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= paths.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= paths.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= paths.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= paths.app %>/scripts/{,*/}*.js'
      ],
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= paths.dist %>/*',
            '!<%= paths.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= paths.app %>/index.html'],
        ignorePath: '<%= paths.app %>/'
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= paths.dist %>/scripts/{,*/}*.js',
            '<%= paths.dist %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= paths.app %>/index.html',
      options: {
        dest: '<%= paths.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= paths.dist %>/index.html'],
      options: {
        assetsDirs: ['<%= paths.dist %>']
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.app %>',
          dest: '<%= paths.dist %>',
          src: [
            '*.html',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= paths.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    concat: {
      generated: {
        files: [ 
          { dest: '.tmp/styles/style.css',
            src: [ '<%= paths.app %>/*.css', '<%= paths.app %>/styles/{,*/}*.css' ] },
          { dest: '.tmp/scripts/editor.js',
            src: [ '<%= paths.app %>/*.js', '<%= paths.app %>/scripts/{,*/}*.js' ] } ]
      }
    },

    uglify: {
      generated: {
        files: [
          { dest: '<%= paths.dist %>/scripts/editor.min.js',
            src: [ '.tmp/scripts/editor.js' ] }
        ]
      }
    },

    cssmin:{
      generated: {
        files:[
          { dest: '<%= paths.dist %>/styles/style.min.css',
            src: [ '.tmp/styles/style.css' ] }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    /*concurrent: {
      server: [
      ],
      dist: [
      ]
    },*/

  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      //'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    //'concurrent:dist',
    'copy:dist',
    'concat',
    'cssmin',
    'autoprefixer',
    'uglify',
    'rev',
    'usemin',
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
};
