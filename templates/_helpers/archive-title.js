
module.exports = function () {
  var helpers = {};

  var yearRegex = /^(\d{4})$/;
  var monthRegex = /^(\d{4})-(\d{2})$/;
  var dayRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

  helpers['archive-normalize'] = function (archive) {
    var results = '';
    if (yearRegex.test(archive)) {
      var yearMatches = archive.match(yearRegex);
      results = new Date((+yearMatches[1]), 0, 1);
    } else if (monthRegex.test(archive)) {
      var monthMatches = archive.match(monthRegex);
      results = new Date((+monthMatches[1]), (+monthMatches[2]) - 1);
    } else {
      var dayMatches = archive.match(dayRegex);
      results = new Date((+dayMatches[1]), (+dayMatches[2]) - 1, dayMatches[3]);
    }
    return results;
  };

  helpers['archive-format'] = function (archive) {
    var results = '';
    // return a format for moment to use based on the archive tag
    if (yearRegex.test(archive)) {
      results =  'YYYY';
    } else if (monthRegex.test(archive)) {
      results = 'MMMM YYYY';
    } else {
      results = 'MMMM DD, YYYY';
    }
    return results;
  };

  return helpers;
};
