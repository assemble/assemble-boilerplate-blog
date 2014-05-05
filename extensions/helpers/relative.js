
var relative = require('relative');

module.exports = function () {

  var helpers = {};
  helpers.relative = function (from, to) {
    return relative(from, to);
  };

  return helpers;
};
