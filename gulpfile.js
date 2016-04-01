/// <binding AfterBuild='bundleLayout' Clean='clean' ProjectOpened='watch' />
"use strict";

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var bower = require('gulp-bower');
var uglify = require('gulp-uglify');
var mincss = require('gulp-cssmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var watch = require('gulp-watch');

var lib = 'wwwroot/lib';
var content = 'wwwroot/content';

var swallowError = function  (error) {
    console.log(error.toString());
    this.emit('end');
};

gulp.task('clean', function (done) {
    return gulp.src([lib+'/js/layout',lib+'/js/bundle'], { read: false }).pipe(rimraf());
});

/* MAKING SURE ALL bower.json FILES ARE INSTALLED */
gulp.task('bower:install', ['clean'], function () {
    return bower();
});

/* MINIFICATION OF BOWER FILES */
gulp.task('minifyJs', ['bower:install'], function () {
    return gulp.src(mainBowerFiles())
        .pipe(ignore.include(["**/*.js"]))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(lib + '/js/layout'));
});

/* BUNDLING */
gulp.task('bundleLayout', ['minifyJs'], function () {
    return gulp.src([
        lib + '/js/layout/angular.min.js',
        lib + '/js/layout/ui-bootstrap-tpls.min.js',
        lib + '/js/layout/angular-cookies.min.js',
        lib + '/js/layout/angular-ui-router.min.js',
        lib + '/js/layout/json-formatter.min.js'
        ])
        .pipe(concat('layout.js'))
        .pipe(gulp.dest(lib + '/js/bundle/'));
});

/* MINIFICATION OF CUSTOM JS */
gulp.task('minifyJsContent', function () {
    return gulp.src(content + '/js/*.js')
        .pipe(uglify({ mangle: false }))
        .on('error', swallowError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(lib + '/js'));
    
});

/* MINIFICATION OF CUSTOM CSS */
gulp.task('minifyCssContent', function () {
    return gulp.src(content + '/css/*.css')
        .pipe(mincss())
        .on('error', swallowError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(lib + '/css/'));
});

gulp.task('watch', function () {
    gulp.watch('bower.json', ['bundleLayout']);

    watch(content + '/js/*.js', function () {
        gulp.start('minifyJsContent').on('error', swallowError);
    });
    watch(content + '/css/*.css', function () {
        gulp.start('minifyCssContent').on('error', swallowError);
    });
});