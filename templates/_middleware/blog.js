/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var file = require('fs-utils');

module.exports = function (assemble) {

  var events = assemble.utils.plugins.events;

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
      var posts = file.expand(assemble.config.blog.posts);
      var parser= strings.parser(':year/:month/:day-:basename.:ext');

      posts.forEach(function (filepath) {
        var post = assemble.utils.component.fromFile(filepath, 'component');
        post.dest = post.data.dest = assemble.config.blog.dest + file.basename(filepath) + '.html';

        // split up the path to generate archive collection tags
        var segments = filepath.split('/');
        var year = segments[segments.length - 3];
        var month = segments[segments.length - 2];
        var basename = file.basename(filepath);
        var key = year + '/' + month;

        var ctx = parser.parse(filepath);
        var yearStucture = strings(':YYYY');
        var monthStructure = strings(':YYYY/:MM');
        var dayStructure = strings(':YYYY/:MM/:DD');

        var date = post.data.date || ctx.date;
        // create required collections
        // year archive
        post.data.archiveYear = [yearStucture.use(strings.date(date)).run()];
        // month archive
        post.data.archiveMonth = [monthStucture.use(strings.date(date)).run()];
        // day archive
        post.data.archiveDay = [dayStucture.use(strings.date(date)).run()];

        post.data.archives = post.data.archives || [];
        post.data.archives.push(key);

        archives:

        assemble.config.pages.push(post);
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
