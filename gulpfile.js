var fs = require('fs');
var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var replace = require('gulp-string-replace');

var prodconfig = require('./config');
var devconfig = require('./dev_config');

var config = null;
var serverURL = null;


gulp.task('build-folder', async () =>
{
    if (!fs.existsSync("./website/build")) { return fs.mkdirSync("./website/build"); }
    else return null;
});

gulp.task('clean', () =>
{   
    return gulp.src("./website/build/")
        .pipe(clean({ force: true }));
});

gulp.task('build-dev', async () => 
{
    config = devconfig;
    return compile();
});

gulp.task('build', () =>
{
    config = prodconfig;
    return compile();
});

async function compile()
{
    
    serverURL = `${config.server.path}:${config.server.port}`;
    return Promise.all([
        compilePug(),
        compileSass(),
        copyContent(),
    ]);
}

async function compilePug() 
{
    return gulp.src('./website/development/views/index.pug')
    .pipe(replace(`#main-wrapper`, `#main-wrapper.rotate-${config.web_application.orientation}`))
    .pipe(pug({ pretty: true }))

    .pipe(gulp.dest('./website/build'))
};

async function compileSass()
{
    
    return gulp.src('./website/development/static/sass/**/*.sass')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./website/build/styles'));
}
    
async function copyContent() 
{
    return Promise.all([
        gulp.src('./website/development/static/images/**/*')
            .pipe(gulp.dest('./website/build/images')),
        
        gulp.src('./website/development/static/scripts/**/*.js')
            .pipe(replace('{serverURL}', serverURL))
            .pipe(gulp.dest('./website/build/scripts')),
    ]);
};

gulp.task('default', gulp.series('build-folder', 'clean', 'build'));
gulp.task('dev', gulp.series('build-folder', 'clean', 'build-dev'));