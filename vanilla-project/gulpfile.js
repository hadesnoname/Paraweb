const { src, dest, task, series, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');
const gulpCopy = require('gulp-copy');
const clean = require('gulp-clean');

task('clean', () => {
    return src('./build', { read: false, allowEmpty: true }) 
        .pipe(clean());
});

task('copy-public', () => {
    return src('./src/public/**/*')
        .pipe(gulpCopy('./build', { prefix: 2 }))
        .pipe(dest('./build'));
});

task('copy-svg', () => {
    return src('./src/assets/svg/**/*.svg')
        .pipe(dest('./build/assets/svg'));
});

task('pug', () => {
    return src('./src/pug/views/**/*.pug')
        .pipe(
            pug({
                
            })
        )
        .pipe(dest('./build'))
        .pipe(browserSync.stream());
});

task('sass', () => {
    return src('./src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./build/css'))
        .pipe(browserSync.stream());
});

task('webpack', () => {
    return src('./src/js/main.js')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(dest('./build/js'))
        .pipe(browserSync.stream());
});

task('server', () => {
    browserSync.init({
        server: { baseDir: 'build/' },
        notify: false,
        online: true
    });
});

task('watch', () => {
    watch('./src/pug/**/*.pug', series('pug'));
    watch('./src/style/**/*.scss', series('sass'));
    watch('./src/js/**/*.js', series('webpack'));
    watch('./src/public/**/*', series('copy-public'));
    watch('./src/assets/svg/**/*.svg', series('copy-svg'));
});

task('serve', series(
    'clean', 
    parallel('pug', 'sass', 'webpack', 'copy-public', 'copy-svg'), 
    parallel('watch', 'server')
));