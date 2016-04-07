var gulp = require('gulp');
var concat = require('gulp-concat');

var jsSrc = [
    'app/app.module.js', 'app/*.js',
    'app/services/*.js',
    'app/filters/*.js',
    'app/login/login.module.js', 'app/login/*.js',
    'app/main/requests/requests.module.js', 'app/main/requests/*.js',
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