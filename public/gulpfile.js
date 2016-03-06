var gulp = require('gulp');
var concat = require('gulp-concat');

var jsSrc = [
    'app/app.module.js', 'app/*.js',
    'app/services/*.js',
    'app/login/login.module.js', 'app/login/*.js',
    'app/main/main.module.js', 'app/main/*.js'
];

gulp.task('default', function() {
    gulp.watch(jsSrc, ['concat']);
});

gulp.task('concat', function() {
    gulp
        .src(jsSrc)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/build'));
});