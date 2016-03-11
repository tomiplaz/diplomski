var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var jsSrc = [
    'app/app.module.js', 'app/*.js',
    'app/services/*.js',
    'app/login/login.module.js', 'app/login/*.js',
    'app/main/main.module.js', 'app/main/*.js', 'app/main/**/*.js'
];

gulp.task('default', function() {
    gulp.watch(jsSrc, ['concat']);
});

gulp.task('concat', function() {
    gulp
        .src(jsSrc)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/build'));
});

gulp.task('browserify', function() {
    return browserify('node_modules/require.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/build'));
})