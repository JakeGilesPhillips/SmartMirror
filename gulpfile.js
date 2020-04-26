var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var replace = require('gulp-string-replace');

var config = require('./config');
var serverURL = `${config.server.path}:${config.server.port}`;

gulp.task('clean', () =>
{   
    return gulp.src("./website/build/")
        .pipe(clean({ force: true }));
});

gulp.task('compile-pug', () =>
{
    return gulp.src('./website/development/views/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('./website/build'));
});

gulp.task('compile-sass', () =>
{
    return gulp.src('./website/development/static/sass/**/*.sass')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./website/build/styles'));
});

gulp.task('copy-content', () =>
{
    return Promise.all([
        gulp.src('./website/development/static/images/**/*')
            .pipe(gulp.dest('./website/build/images')),
        
        gulp.src('./website/development/static/scripts/**/*.js')
            .pipe(replace('{serverURL}', serverURL))
            .pipe(gulp.dest('./website/build/scripts'))
    ]);
});

gulp.task('default', gulp.series('clean', ['compile-pug', 'compile-sass'], 'copy-content'));