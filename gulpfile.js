const gulp = require('gulp'),
    del = require('del'),
    download = require('gulp-download'),
    decompress = require('gulp-decompress'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    ext_replace = require('gulp-ext-replace'),
    clean = require('gulp-clean'),
    multiDest = require('gulp-multi-dest');

// Paths
const frontend = new function () {
    this.root = './front-end';
    this.all = this.root + '/**/*.*';
    this.src = this.root + '/src/';
    this.dist = this.root + '/dist/';
    this.css = this.src + '/assets/css/';
    this.sass = this.src + '/assets/sass/**/*.scss';
    this.js = this.src + '/assets/js/**/*.js';
    this.images = this.src + '/assets/img/**/*.*';
};
const backend = new function () {
    this.url = 'https://wordpress.org';
    this.version = 'latest.zip';
    this.proxy = 'http://localhost:8888';
    this.root = './back-end';
    this.src = this.root + '/src/';
    this.dist = this.root + '/dist/';
    this.server = this.root + '/server/';
    this.tmp = this.root + '/tmp/';
    this.themeName = 'snowfall-boilerplate';
    this.themeFolder = this.server + '/wp-content/themes/' + this.themeName;
};

// ===================================================
// 1. Front-end
// ===================================================

// 1.1 - Minify CSS with SASS
function styles() {
    return (
        gulp
        .src(frontend.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(frontend.css))
    );
};
exports.styles = styles

// 1.2 - Minify JavaScript
function scripts() {
    return (
        gulp
        .src(frontend.js, {
            sourcemaps: true
        })
        .pipe(uglify())
        // .pipe(concat('main.min.js'))
        .pipe(gulp.dest(frontend.dist + '/assets/js/'))
    );
};
exports.scripts = scripts

// 1.3 - Minify Images
function images() {
    return (
        gulp
        .src(frontend.src + '/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(frontend.dist))
    )
};
exports.images = images

// 1.4 - Minify HTML 
function html() {
    return (
        gulp
        .src(frontend.src + '/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest(frontend.dist))
    )
};
exports.html = html

// 1.5 - Live Server
function frontendServer() {
    browserSync.init({
        server: {
            baseDir: frontend.src
        }
    });
    frontendWatch();
};
exports.frontendServer = frontendServer

// 1.6 - Watch
function frontendWatch() {
    gulp.watch(frontend.sass, styles)
    gulp.watch(frontend.all).on('change', browserSync.reload);
};
exports.frontendWatch = frontendWatch

// 1.7 - Build and Deploy
const frontendDeploy = gulp.series(() => del(frontend.dist), styles, images, scripts, html)

// 1.8 - Commands
gulp.task('frontend:build', frontendDeploy)
gulp.task('frontend:start', frontendServer)

//
// ===================================================
// 2. Back-end
// ===================================================
//
// Fisrt steps:
// * Start PHP and MySQL servers 
// * Create a WordPress database
//

// 2.1 - Download Wordpress
function wpDownload() {
    return (
        download(backend.url + '/' + backend.version)
        .pipe(gulp.dest(backend.tmp))
    )
};
exports.wpDownload = wpDownload

// 2.2 - Decompress Wordpress and add to server folder
function wpUnzip() {
    return (
        gulp
        .src(backend.tmp + '/*.{tar,tar.bz2,tar.gz,zip}')
        .pipe(decompress({
            strip: 1
        }))
        .pipe(gulp.dest(backend.server))
    )
};
exports.wpUnzip = wpUnzip

// 2.3 - Copy files from Front-end to Back-end workfolder and server folder
// 2.3.1 -  Copy files 
function backendCopyToTemp() {
    return (
        gulp
        .src(frontend.src + '/**/*.*')
        .pipe(gulp.dest(backend.tmp))
    )
}
exports.backendCopyToTemp = backendCopyToTemp

// 2.3.2 - Rename index files to php
function backendRename() {
    return (
        gulp
        .src(backend.tmp + '/**/*.html')
        .pipe(ext_replace('.php'))
        .pipe(gulp.dest(backend.tmp))
    )
}
exports.backendRename = backendRename

// 2.3.3 -  Delete html files 
function backendClean() {
    return (
        gulp
        .src(backend.tmp + '/**/*.html')
        .pipe(clean())
    )
}
exports.backendClean = backendClean

// 2.3.4 -  Copy files to workfolder and server
function backendCopyToWork() {
    return (
        gulp
        .src(backend.tmp + '/**/*.*')
        .pipe(multiDest([backend.src, backend.themeFolder]))
    )
}
exports.backendCopyToWork = backendCopyToWork


// 2.3.5 - Run all tasks in series 
const wpCopy = gulp.series([backendCopyToTemp, backendRename, backendClean, backendCopyToWork, () => del(backend.tmp)]);
gulp.task('wpCopy', wpCopy)


// 2.4 - Delete WordPress files
function wpClean() {
    return (
        del([backend.tmp, backend.server])
    )
};
exports.wpClean = wpClean

// 2.5 - BrowserSync 
function wpLive() {
    return (
        gulp
        .src(backend.src + '**/*.*')
        .pipe(gulp.dest(backend.themeFolder))
        .pipe(browserSync.stream())
    )
};
exports.wpLive = wpLive

// 2.6 - Start server
function wpStart() {
    browserSync.init({
        proxy: backend.proxy + '/' + backend.themeName + '/' + backend.server
    });
    wpWatch()
};
exports.wpStart = wpStart

// 2.7 - Watch
function wpWatch() {
    gulp.watch(backend.src).on('change', wpLive);
};
exports.wpWatch = wpWatch

// 2.8 - Back-end commands 
const install = gulp.series(wpClean, wpDownload, wpUnzip, () => del(backend.tmp), wpCopy)
gulp.task('backend:install', install)
gulp.task('backend:start', wpStart)