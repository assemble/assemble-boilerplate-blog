/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var file = require('fs-utils');
var strings = require('strings');
var Strings = require('strings/lib/strings');
var utils = require('./lib/utils');

module.exports = function (assemble) {
  var events = assemble.utils.middleware.events;

  // using the specified folders, load posts as pages
  var middleware = function (params, done) {
    assemble.log.debug('\t[plugin]: ', 'assemble-middleware-archives', params.event);
    assemble.log.debug('\t[params]:', params);

    if (assemble.config.blog) {
      var blogOptions = assemble.config.blog;
      var postsPatterns = blogOptions.posts;


      /**
       * Collections
       */

      // make sure collections options are there
      assemble.config.collections = assemble.config.collections || [];
      var archivesCollection = null;
      for (var i = 0; i < assemble.config.collections.length; i++) {
        if (assemble.config.collections[i].name && assemble.config.collections[i].name === 'archive') {
          archivesCollection = assemble.collections[i];
        }
      }

      if (archivesCollection === null) {
        archivesCollection = blogOptions.archives;
        assemble.config.collections.push(archivesCollection);
      }
      assemble.config.pages = assemble.config.pages || [];


      /**
       * Posts
       */

      // Expand post filepaths (not really loading them)
      var posts = file.expandMapping(postsPatterns, blogOptions);

      //var parser = strings.parser(':year/:month/:day-:basename.:ext');
      var parser = {
        parse: utils.parsePostPaths // Say that five times fast
      };

      posts.forEach(function (fp) {
        fp.src.forEach(function (filepath) {
          var post = assemble.utils.component.fromFile(filepath, 'component');
          post.src = post.data.src = filepath;
          post.dest = utils.resolveDest(post.src, (blogOptions.dest + fp.dest), false, assemble.config);

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

          if (!post.data.permalinks && blogOptions.structure) {
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


  middleware.event = 'assemble:before:configuration';
  return {
    'assemble-blog-load-posts': middleware
  };
};