
/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var path = require('path');

var _ = require('lodash');
var file = require('fs-utils');
var assemble = require('assemble');
var normalize = require('normalize-config');


var pkg = require('package.json');
var deps = _.keys(pkg.dependencies).concat(_.keys(pkg.devDependencies));
var middleware = require('matched')(deps, ['assemble-middleware-*']);

var pages = [];
var files = file.expandMapping(['**/*.hbs'], {
  expand: true,
  cwd: 'templates/pages/',
  flatten: false,
  dest: '_gh_pages'
});

files.forEach(function (fp) {
  fp.src.forEach(function (filepath) {
    var page = assemble.utils.component.fromFile(filepath, 'component');
    page.dest = page.data.dest = '_gh_pages/' + fp.dest;
    pages.push(page);
  });
});

var options = {
  layout: 'default',
  layoutext: '.hbs',
  layoutdir: 'templates/layouts/',
  middleware: middleware.concat(['templates/_middleware/blog.js']),
  assets: '_gh_pages/assets',
  pages: pages,
  blog: {
    posts: ['**/*.md'],
    dest: '_gh_pages/blog/',
    cwd: 'templates/posts',
    expand: true,
    flatten: false,
    structure: ':basename/index.html',
    archives: {
      name: 'archive',
      plural: 'archives',
      related_pages: {
        template: 'templates/layouts/posts.hbs',
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
  var pageKeys = _.keys(results.pages);
  pageKeys.forEach(function (pageKey) {
    var page = results.pages[pageKey];
    console.log('Writing out ["' + page.dest + '"]');
  });
});
