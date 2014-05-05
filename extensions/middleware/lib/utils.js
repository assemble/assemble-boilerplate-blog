var path = require('path');
var file = require('fs-utils');


exports.parsePostPaths = function (filepath) {
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
    results.date = new Date(results.year, results.month, results.day);
  }
  return results;
};


exports.resolveDest = function (src, dest, expanded, options) {
  if ((file.lastChar(dest) === '/' || file.lastChar(dest) === '\\') && expanded === false) {
    if (options.flatten) {
      src = file.basename(src);
    }
    dest = path.join(dest, src);
  }

  var destDirname = file.dirname(dest);
  var destBasename = file.basename(dest);
  dest = file.normalizeSlash(path.join(destDirname, destBasename)) + options.ext;
  return dest;
};

