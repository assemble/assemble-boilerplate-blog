
/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var path = require('path');
var assemble = require('assemble');
var file = require('fs-utils');
var _ = require('lodash');
var normalize = require('normalize-config');

// load middleware from the dependencies
var loadExtensions = require('./templates/_middleware/lib/load');
var middleware = loadExtensions('assemble-middleware-*');
var helpers = loadExtensions('handlebars-helper-*');

// find the pages we want to build and turn
// them into assemble components
var pages = [];
var files = file.expandMapping(['**/*.hbs'], {
  flatten: false,
  expand: true,
  ext: '.html',
  cwd: 'templates/pages/',
  dest: '_gh_pages'
});

files.forEach(function (fp) {
  fp.src.forEach(function (filepath) {
    var page = assemble.utils.component.fromFile(filepath, 'component');
    console.log(fp.dest);
    page.dest = page.data.dest = '_gh_pages/' + fp.dest;
    pages.push(page);
  });
});



// setup the configuration options to pass to assemble
var options = {
  assets: '_gh_pages/assets',

  // Layouts
  layout: 'post',
  layoutext: '.hbs',
  layoutdir: 'templates/layouts/',

  // Extensions
  middleware: middleware.concat(['templates/_middleware/blog.js']),
  pages: pages,


  blog: {
    posts: ['**/*.md'],
    dest: '_gh_pages/blog/',
    cwd: 'templates/posts/',
    expand: true,
    flatten: false,
    structure: ':basename/index.html',
    archives: {
      name: 'archive',
      plural: 'archives',
      related_pages: {
        template: 'templates/layouts/list.hbs',
        dest: '<%= blog.dest %>archives/',
        pagination: {
          prop: 'num',
          limit: 5,
          sortby: 'date'
        },
        permalinks: {
          structure: ':archive/:numindex.html',
          replacements: [
            {
              pattern: ':num',
              replacement: function () {
                if (this.num === 1) {
                  return '';
                }
                return this.num + '/';
              }
            }
          ]
        }
      }
    }
  }
};

assemble(options).build(function(err, results) {
  if (err) {
    console.log('Error', err);
    return done(err);
  }

  _.keys(results.pages).forEach(function (pageKey) {
    var page = results.pages[pageKey];
    console.log('  [writing]', page.dest);
    if (page.dest && page.dest !== '.') {
      file.writeFileSync(page.dest, page.content);
    }
  });
});
