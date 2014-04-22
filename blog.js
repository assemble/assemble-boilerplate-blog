/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var file = require('fs-utils');

module.exports = function (assemble) {

  var events = assemble.config.plugins.events;

  // using the specified folders, load posts as pages
  var loadPosts = function (params, done) {
    assemble.log.debug('\t[plugin]: ', 'assemble-blog-load-posts plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    if (assemble.options.blog) {

      // make sure collections options are there
      assemble.options.collections = assemble.options.collections || [];
      var archivesCollection = null;
      for (var i = 0; i < assemble.options.collections.length; i++) {
        if (assemble.options.collections[i].name && assemble.options.collections[i].name === 'archive') {
          archivesCollection = assemble.collections[i];
        }
      }

      if (archivesCollection === null) {
        archivesCollection = {
          name: 'archive',
          plural: 'archives'
        };
        archivesCollection.index = assemble.options.blog.index;
        archivesCollection['related_pages'] = assemble.options.blog['related_pages'];
        assemble.options.collections.push(archivesCollection);
      }

      assemble.pages = assemble.pages || [];

      // load posts
      var posts = file.expand(assemble.options.blog.posts);

      posts.forEach(function (filepath) {
        var post = assemble.models.Component.readFile(filepath, 'component');

        // split up the path to generate archive collection tags
        var segments = filepath.split('/');
        var year = segments[segments.length - 3];
        var month = segments[segments.length - 2] - 1;
        var basename = file.basename(filepath);
        var date = new Date(year, month);

        post.metadata.archives = post.metadata.archives || [];
        post.metadata.archives.push(date);

        assemble.pages.push(post);
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

  var plugins = {};
  plugins[loadPosts.options.name] = loadPosts;
  return plugins;
};
