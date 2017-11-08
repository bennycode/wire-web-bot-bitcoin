const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('build', () =>
  gulp.src('app.js').pipe(zip('project.zip')).pipe(gulp.dest('dist'))
);
