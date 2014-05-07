/*
 * blog
 * https://github.com/Jon Schlinkert/blog
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

require('coffee-script/register');
var load = require('resolve-dep');

var _ = require('lodash');

module.exports = function(grunt) {

  var collections = require('./extensions/config');

  // Project configuration.
  grunt.initConfig({

    site: grunt.file.readYAML('.assemblerc.yml'),
    pkg: grunt.file.readJSON('package.json'),


    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.public %>',

        // Metadata
        site: '<%= site %>',
        blog: '<%= site.blog %>',
        data: ['<%= site.data %>/{,*/}*.{json,yml}'],

        // Includes
        partials: ['<%= site.includes %>/*.hbs'],
        collections: collections,

        // Layouts
        layoutdir: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: [load('handlebars-*'), '<%= site.helpers %>/*.js'],
        middleware: [load('assemble-middleware-*'), '<%= site.middleware %>/*.js'],

        // permalinks middleware options
        permalinks: {
          preset: 'pretty'
        }
      },
      blog: {
        options: {theme: 'blog'},
        files: {'<%= site.dest %>/': ['<%= site.templates %>/pages/*.hbs']}
      }
    },

    /**
     * Compile LESS to CSS
     */
    less: {
      options: {
        paths: ['styles/vendor/bootstrap', 'styles/themes/blog'],
      },
      blog: {
        options: {
          globalVars: {theme: 'blog'}
        },
        src: ['styles/index.less'],
        dest: '<%= site.public %>/css/blog.css'
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-assemble-less');
  grunt.loadNpmTasks('grunt-assemble');

  // Default tasks to be run.
  grunt.registerTask('default', ['less', 'assemble']);
};
