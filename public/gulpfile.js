var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function() {
    gulp
        .src([
            'app/app.module.js', 'app/*.js',
            'app/login/login.module.js', 'app/login/*.js'
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/build'));
})