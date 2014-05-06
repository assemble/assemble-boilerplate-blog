/**
 * Blog middleware config. This can be fully customized,
 * but it's kept separate from the gulpfile since this
 * is also reusable on other projects, as-is.
 *
 */

// load middleware from the dependencies
var loadExtensions = require('./extensions/middleware/lib/load');
var middleware = loadExtensions('assemble-middleware-*');
var helpers = loadExtensions('handlebars-helper-*');

// setup the configuration options to pass to assemble
var options = {
  assemblerc: '.assemblerc.yml',
  middleware: middleware.concat(['./extensions/middleware/*.js']),
  helpers: helpers.concat(['./extensions/helpers/*.js']),
  blog: {
    archives: {
      related_pages: {
        permalinks: {
          replacements: [
            {
              pattern: ':archive',
              replacement: function () {
                return this.archive.replace(/-/g, '/');
              }
            },
            {
              pattern: ':num',
              replacement: function () {
                if (this.num === 1) {
                  return '';
                }
                return this.num + '/';
              }
            }
          ]
        }
      }
    }
  }
};