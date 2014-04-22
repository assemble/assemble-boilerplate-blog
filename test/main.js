/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var path = require('path');

var expect = require('chai').expect;
var assemble = require('assemble');

describe('assemble-blog plugin', function () {

  it('should load posts as pages', function (done) {
    var options = {
      metadata: {
        log: {
          level: 'debug'
        },
        plugins: ['blog.js'],
        blog: {
          posts: ['test/fixtures/posts/**/*.md'],
          dest: 'test/actual/posts/',
          structure: ':basename/index.html',
          archive: {
            prop: ':num',
            structure: ':YYYY/:MM/:num/index.html'
          }
        }
      }
    };

    assemble(options).build(function(err, results) {
      if (err) {
        console.log('Error', err);
        return done(err);
      }
      console.log('pages', results.pages[0].metadata);
      console.log('options', results.options);
      done();
    });
  });

});
