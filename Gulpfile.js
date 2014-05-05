var gulp = require('gulp');
var assemble = require('gulp-assemble');


var path = require('path');

var _ = require('lodash');
var file = require('fs-utils');
var normalize = require('normalize-config');

// load middleware from the dependencies
var pkg = require('package.json');
var deps = _.keys(pkg.dependencies).concat(_.keys(pkg.devDependencies));
var middleware = require('matched')(deps, ['assemble-middleware-*']);
var helpers = require('matched')(deps, ['handlebars-helper-*']);

//// find the pages we want to build and turn
//// them into assemble components
//var pages = [];
//var files = file.expandMapping(['**/*.hbs'], {
//  expand: true,
//  cwd: 'templates/pages/',
//  flatten: false,
//  dest: '_gh_pages',
//  ext: '.html'
//});

//files.forEach(function (fp) {
//  fp.src.forEach(function (filepath) {
//    var page = assemble.utils.component.fromFile(filepath, 'component');
//    page.dest = page.data.dest = '_gh_pages/' + fp.dest;
//    pages.push(page);
//  });
//});

// setup the configuration options to pass to assemble
var options = {
  assemblerc: '.assemblerc.yml',
  middleware: middleware.concat(['templates/_middleware/blog.js']),
  helpers: helpers.concat(['templates/_helpers/**/*.js']),
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
gulp.task('default', function () {
  gulp.src('templates/pages/**/*.hbs')
    .pipe(assemble('w00t', options))
    .pipe(gulp.dest('_gh_pages/'));
});
