'use strict';
var path = require('path');
var resolve = require('resolve');
var matched = require('matched');
var file = require('fs-utils');
var _ = require('lodash');
var pkg = require(path.join(process.cwd(), './package.json'));

// load middleware from the dependencies
module.exports = function (patterns, options) {
  options = options || {};
  var deps = [];
  var types =  ['dependencies', 'devDependencies', 'peerDependencies'];

  var modules = _.map(types, function(type) {
    return _.keys(pkg[type]);
  });

  var matches = matched(modules, patterns);
  if (matches.length) {
    _.each(matches, function(match) {
      deps = deps.concat(resolve.sync(match));
    });
  }
  return deps.map(file.normalizeSlash);
};