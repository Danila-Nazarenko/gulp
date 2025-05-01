

import browserSync from 'browser-sync';
import { src, dest, watch, parallel } from 'gulp';
import scss from 'gulp-sass';
import * as sass from 'sass'; // <-- исправлено здесь
import concat from 'gulp-concat';
import uglifyModule from 'gulp-uglify-es'; // <-- импорт модуля
const uglify = uglifyModule.default;       // <-- получение функции по умолчанию
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';

const gulpSass = scss(sass);

function scripts() {

    return src([
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(gulpSass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], cascade: false }))
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['app/scss//*.scss'], styles);
    watch(['app/js//.js'], scripts);
    watch(['app/.html']).on('change', browserSync.reload);
}


function build() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*.html'
    ], {base : 'app'})
    .pipe(dest('dist'))
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

export { styles, scripts, watching, browsersync,cleanDist, build  };
export default parallel(styles, scripts, browsersync, watching,cleanDist, build );