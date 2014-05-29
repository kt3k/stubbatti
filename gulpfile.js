// gulpfile.js

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var exec = require('child_process').exec;


gulp.task('jshint', function () {

    return gulp.src('{./,src/,bin/,test/}*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

});

gulp.task('mocha', ['jshint'], function (cb) {

    exec('mocha -R spec test/', function (err, stdout, stderr) {

        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        cb(err);
    });

});

gulp.task('default', ['mocha']);
