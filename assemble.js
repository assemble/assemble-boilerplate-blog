
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

// load middleware from the dependencies
var pkg = require('package.json');
var deps = _.keys(pkg.dependencies).concat(_.keys(pkg.devDependencies));
var middleware = require('matched')(deps, ['assemble-middleware-*']);

// find the pages we want to build and turn
// them into assemble components
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

// setup the configuration options to pass to assemble
var options = {
  assemblerc: '.assemblerc.yml',
  middleware: middleware.concat(['templates/_middleware/blog.js']),
  pages: pages,
  blog: {
    archives: {
      related_pages: {
        permalinks: {
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
    if (page.dest && page.dest !== '.') {
      file.writeFileSync(page.dest, page.content);
    }
  });
});