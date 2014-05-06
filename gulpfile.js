'use strict';

require('coffee-script/register');
var gulp = require('gulp');

var assemble = require('gulp-assemble');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
// var mocha = require('gulp-mocha');
var options = require('./extensions/config');


gulp.task('assemble', function () {
  gulp.src('templates/pages/**/*.hbs')
    .pipe(assemble(options))
    .pipe(gulp.dest('_gh_pages/'));
});

gulp.task('lint', function () {
  gulp.src(['extensions/*.js', 'test/*.js', '*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function () {
  gulp.src(['_gh_pages/**/*.html'], {read: false})
    .pipe(clean());
});

// gulp.task('test', function () {
//   gulp.src(['test/test.js'])
//     .pipe(mocha({reporter: 'spec'}));
// });

gulp.task('default', ['assemble', 'clean', 'lint', 'test']);