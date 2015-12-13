'use strict';
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    summary = require('jshint-summary'),

    jshintOptions = {
        browser: true,
        strict: true,
        eqeqeq: true,
        unused: true,
        node: true,
        validthis: true,
        esnext: true,
        globals: {
            process: true
        }
    },
    jsfiles = ['./*.js', './module/**/*.js'];


function lint() {
    return gulp.src(jsfiles)
        .pipe(jshint(jshintOptions))
        .pipe(jshint.reporter(summary));
}

gulp.task('default', function(){
    lint();

    // Отслеживаем изменения в файлах
    gulp.watch(jsfiles, function(){
        console.log('===========' + Date() + '===========');
        lint();
    });
});