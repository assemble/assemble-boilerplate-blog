/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

module.exports = function (assemble) {
  helpers.icons = function (name) {
    var svg = [
      '<svg viewBox="0 0 8 8" class="icon">',
      '  <use xlink:href="open-iconic.min.svg#' + name + '"></use>',
      '</svg>'
    ];
    return new Handlebars.SafeString(svg);
  };

  return helpers;
};
