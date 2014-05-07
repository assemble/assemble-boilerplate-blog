/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

var path = require('path');
var fs = require('fs');

// node_modules
var _ = require('lodash');

// Export helpers
module.exports = function (assemble) {
  'use strict';

  var Handlebars = assemble.Handlebars;
  var helpers = {};


  /**
   * {{pager}} helper
   *
   * Adds a pager to enable navigating to prev and next page/post.
   * @param  {Object} context Context to pass to the helper, most likely `pagination`.
   * @param  {Object} opts    Pass a modifier class to the helper.
   * @return {String}         The pager, HTML.
   */

  helpers.pager = function (context, opts) {
    context = _.extend({}, context, opts.hash);

    var template = [
    ' {{debug @root}}',
      '{{#is @root.page.index 1}}',
      '  <ul class="pager {{modifier}}">',
      '    <li class="pager-heading">POPULAR</li>',
      '    <li class="previous"><a href="{{relative @root.page.dest prev.dest}}">&larr; Previous</a></li>',
      '    <li class="next"><a href="{{relative @root.page.dest next.dest}}">Next &rarr;</a></li>',
      '  </ul>',
      '{{else}}',
      '  {{#is currentPage totalPages}}',
      '    <ul class="pager {{modifier}}">',
      '      <li class="previous"><a href="{{relative @root.page.dest prev.dest}}">&larr; Previous</a></li>',
      '      <li class="next disabled"><a href="{{!relative @root.page.dest next.dest}}">Next &rarr;</a></li>',
      '    </ul>',
      '  {{else}}',
      '    <ul class="pager {{modifier}}">',
      '      <li class="previous"><a href="{{!relative @root.page.dest prev.dest}}">&larr; Previous</a></li>',
      '      <li class="next"><a href="{{!relative @root.page.dest next.dest}}">Next &rarr;</a></li>',
      '    </ul>',
      '  {{/is}}',
      '{{/is}}'
    ].join('\n');

    return new Handlebars.SafeString(Handlebars.compile(template)(context));
  };

  return helpers;
};