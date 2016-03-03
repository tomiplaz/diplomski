var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function() {
    gulp
        .src([
            'app/app.module.js', 'app/*.js',
            'app/services/*.js',
            'app/login/login.module.js', 'app/login/*.js',
            'app/users/users.module.js', 'app/users/*.js',
            'app/users/0/users.0.module.js', 'app/users/0/*.js',
            'app/users/1/users.1.module.js', 'app/users/1/*.js'
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/build'));
})