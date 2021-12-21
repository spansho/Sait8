const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const Spritesmith = require('spritesmith');
const rimraf = require("browser-sync/dist/config");
const rename = require("gulp-rename");

/* Serer */
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* Pug compile old */
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/* Styles compile */
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build'));
});

/* Generate our spritesmith */
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/img/icons/*.*');
    /*spriteData.pipe(Spritesmith({
        imgName: 'sprite.png',
        //imgPath: '../images/sprite.png',
        cssName: 'sprite.css',
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.scss.pipe(gulp.dest('source/styles/global/'));*/
    cb();
});

gulp.task('clean', function del(cb) {
    return rimraf('build', cd);
});

gulp.task('copy:fonts', function () {
    return gulp.src('source/fonts/*')
        .pipe(gulp.src('build/fonts'))
});

gulp.task('copy:images', function () {
    return gulp.src('source/img/*')
        .pipe(gulp.src('build/img'))
});

gulp.task('copy', gulp.parallel('copy:fonts','copy:images'));

gulp.task('watch', function () {
    gulp.watch('source/template/**/*.png', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series( //'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));