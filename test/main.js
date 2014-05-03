/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var path = require('path');

var _ = require('lodash');
var file = require('fs-utils');
var expect = require('chai').expect;
var assemble = require('assemble');

describe('assemble-middleware-blog', function () {

  it('should load posts as pages', function (done) {
    var options = {
      layout: 'test/fixtures/layouts/post.hbs',
      middleware: [
        'assemble-middleware-permalinks',
        'templates/_middleware/blog.js'
      ],
      flatten: false,
      assets: 'test/actual/assets',
      blog: {
        posts: ['test/fixtures/posts/**/*.md'],
        dest: 'test/actual/blog/',
        structure: ':basename/index.html',
        archives: {
          name: 'archive',
          plural: 'archives',
          related_pages: {
            template: 'test/fixtures/layouts/posts.hbs',
            dest: '<%= blog.dest %>archives/',
            pagination: {
              prop: 'num',
              limit: 3,
              sortby: 'date'
            },
            permalinks: {
              structure: ':archive/:numindex.html',
              replacements: [
                {
                  pattern: ':num',
                  replacement: function () {
                    console.log('num', this.num);
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
        console.log('dest', page.dest);
        console.log('data', page.data.permalinks);
        if (page.dest && page.dest !== '.') {
          file.writeFileSync(page.dest, page.content);
        }
      });
      done();
    });
  });

});
