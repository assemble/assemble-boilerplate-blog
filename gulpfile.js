'use strict';

var gulp = require('gulp');

var assemble = require('gulp-assemble');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var verb = require('gulp-verb');
var config = require('./extensions/config.js');



gulp.task('assemble', function () {
  gulp.src('templates/pages/**/*.hbs')
    .pipe(assemble(options))
    .pipe(gulp.dest('_gh_pages/'));
});

// gulp.task('lint', function () {
//   gulp.src(['lib/*.js', 'test/*.js', '*.js'])
//     .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'));
// });

// gulp.task('clean', function () {
//   gulp.src(['test/actual'], {read: false})
//     .pipe(clean());
// });

// gulp.task('test', ['clean', 'lint'], function () {
//   gulp.src(['test/*_test.js'])
//     .pipe(mocha({reporter: 'spec'}));
// });

gulp.task('docs', function () {
  gulp.src(['.verbrc.md'])
    .pipe(verb({dest: 'README.md'}))
    .pipe(gulp.dest('./'));
});


// gulp.task('default', ['assemble', 'test', 'docs']);
gulp.task('default', ['assemble', 'docs']);