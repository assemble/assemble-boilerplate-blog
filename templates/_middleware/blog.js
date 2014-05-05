/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var file = require('fs-utils');
var strings = require('strings');
var Strings = require('strings/lib/strings');

module.exports = function (assemble) {

  var events = assemble.utils.middleware.events;

  // using the specified folders, load posts as pages
  var loadPosts = function (params, done) {
    assemble.log.debug('\t[plugin]: ', 'assemble-blog-load-posts plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    if (assemble.config.blog) {

      // make sure collections options are there
      assemble.config.collections = assemble.config.collections || [];
      var archivesCollection = null;
      for (var i = 0; i < assemble.config.collections.length; i++) {
        if (assemble.config.collections[i].name && assemble.config.collections[i].name === 'archive') {
          archivesCollection = assemble.collections[i];
        }
      }

      if (archivesCollection === null) {
        archivesCollection = assemble.config.blog.archives;
        assemble.config.collections.push(archivesCollection);
      }

      assemble.config.pages = assemble.config.pages || [];

      // load posts
      var posts = file.expandMapping(assemble.config.blog.posts, assemble.config.blog);
      //var parser = strings.parser(':year/:month/:day-:basename.:ext');

      var parser = {
        parse: function (filepath) {
          // {YYYY}/{MM}/{DD}-{basename}{ext}
          var re = /(\d{4})\/(\d{2})\/(\d{2})-(.*)(\..*)$/;
          var matches = filepath.match(re);
          var results = {};
          if (matches) {
            results.year = matches[1];
            results.month = matches[2];
            results.day = matches[3];
            results.basename = matches[4];
            results.ext = matches[5];
            results.date = new Date(results.year, (results.month - 1), results.day);
          }
          return results;
        }
      };

      posts.forEach(function (fp) {
        fp.src.forEach(function (filepath) {
          var post = assemble.utils.component.fromFile(filepath, 'component');
          post.src = post.data.src = filepath;
          post.dest = assemble.utils.utils.generateDestination(post.src, (assemble.config.blog.dest + fp.dest), false, assemble.config);

          var ctx = parser.parse(filepath);
          var yearStructure = new Strings({structure: ':YYYY'});
          var monthStructure = new Strings({structure: ':YYYY-:MM'});
          var dayStructure = new Strings({structure: ':YYYY-:MM-:DD'});

          var date = post.data.date || ctx.date;
          post.data.date = post.data.date || date;

          // add the required tags to the archive collection
          post.data.archives = post.data.archives || [];
          // year archive
          post.data.archives.push(yearStructure.use(strings.dates(date)).run());
          // month archive
          post.data.archives.push(monthStructure.use(strings.dates(date)).run());
          // day archive
          post.data.archives.push(dayStructure.use(strings.dates(date)).run());

          if (!post.data.permalinks && assemble.config.blog.structure) {
            post.data.permalinks = {
              structure: assemble.config.blog.structure
            };
          }

          assemble.config.pages.push(post);
        });
      });
    }

    done();
  };

  loadPosts.options = {
    name: 'assemble-blog-load-posts',
    description: '',
    events: [
      events.assembleBeforeConfiguration
    ]
  };

  var middleware = {};
  middleware[loadPosts.options.name] = loadPosts;
  return middleware;
};
