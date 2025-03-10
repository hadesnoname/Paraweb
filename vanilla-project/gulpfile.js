const { src, dest, task, series, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');
const gulpCopy = require('gulp-copy');
const clean = require('gulp-clean'); // Импортируем gulp-clean

// Задача для очистки папки ./build
task('clean', () => {
    return src('./build', { read: false, allowEmpty: true }) // allowEmpty позволяет не выбрасывать ошибку, если папка не существует
        .pipe(clean());
});

// Задача для копирования публичных файлов
task('copy-public', () => {
    return src('./src/public/**/*')
        .pipe(gulpCopy('./build', { prefix: 2 }))
        .pipe(dest('./build'));
});

// Задача для компиляции Pug
task('pug', () => {
    return src('./src/pug/views/**/*.pug')
        .pipe(
            pug({
                // Ваши опции здесь
            })
        )
        .pipe(dest('./build'))
        .pipe(browserSync.stream());
});

// Задача для компиляции SCSS в CSS
task('sass', () => {
    return src('./src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./build/css'))
        .pipe(browserSync.stream());
});

// Задача для сборки JavaScript с помощью Webpack
task('webpack', () => {
    return src('./src/js/main.js')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(dest('./build/js'))
        .pipe(browserSync.stream());
});

// Задача для запуска сервера BrowserSync
task('server', () => {
    browserSync.init({
        server: { baseDir: 'build/' },
        notify: false,
        online: true
    });
});

// Наблюдение за изменениями в Pug, SCSS, JS и публичных файлах
task('watch', () => {
    watch('./src/pug/**/*.pug', series('pug'));
    watch('./src/style/**/*.scss', series('sass'));
    watch('./src/js/**/*.js', series('webpack'));
    watch('./src/public/**/*', series('copy-public'));
});

// Основная задача для запуска всех задач
task('serve', series(
    'clean', // Очистка папки ./build перед выполнением других задач
    parallel('pug', 'sass', 'webpack', 'copy-public'), // Параллельное выполнение задач
    parallel('watch', 'server') // Параллельное выполнение наблюдения и сервера
));