'use strict';

const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const wait = require('gulp-wait');
const fileInclude = require("gulp-file-include");

let postCssPlugins = [
  autoprefixer({
    browsers: ['last 2 version']
  }),
];

gulp.task('style', function () {
  return gulp.src('src/scss/style.scss')
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'Styles compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(wait(100))
    .pipe(sass())
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(fileInclude({
      indent: true,
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('copy:img', function () {
  return gulp.src('src/img/**/*.{jpg,png,svg}')
    .pipe(gulp.dest('build/img'));
});

gulp.task('copy:fonts', function () {
  return gulp.src('src/fonts/*.{ttf,woff,woff2,eot,svg}')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:js', function () {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy:css', function () {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function () {
  return del([
    'build/**/*',
    'build/readme.md',
  ]);
});

gulp.task('build', function (callback) {
  gulpSequence(
    'clean',
    ['style', 'copy:img', 'copy:fonts', 'copy:js', 'copy:css'],
    'html',
    callback
  );
});

gulp.task('default', ['serve']);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: 'build',
    startPath: 'index.html',
    open: false,
    port: 8080,
  });
  gulp.watch([
    'src/scss/style.scss',
  ], ['style']);
  gulp.watch([
    'src/*.html',
    'src/_html-include/*.html',
  ], ['watch:html']);
  gulp.watch('src/img/**/*.{jpg,png,svg}', ['watch:img']);
  gulp.watch('src/fonts/*.{ttf,woff,woff2,eot,svg}', ['watch:fonts']);
  gulp.watch('src/js/*.js', ['watch:js']);
});

gulp.task('watch:html', ['html'], reload);
gulp.task('watch:img', ['copy:img'], reload);
gulp.task('watch:fonts', ['copy:fonts'], reload);
gulp.task('watch:js', ['copy:js'], reload);

gulp.task('deploy', function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

function reload (done) {
  browserSync.reload();
  done();
}

var onError = function(err) {
  notify.onError({
    title: 'Error in ' + err.plugin,
  })(err);
  this.emit('end');
};
