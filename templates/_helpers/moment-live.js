
var momentHelper = require('handlebars-helper-moment');

module.exports = function (config) {
  var moment = momentHelper(config);
  var Handlebars = config.Handlebars;
  var helpers = {};

  helpers['moment-live'] = function (date, options) {
    var html = '<span data-moment="' + date + '">' + moment.moment(date, options) + '</span>';
    return new Handlebars.SafeString(html);
  };

  return helpers;
};
