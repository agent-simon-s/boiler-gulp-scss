/**
 * Created by sjds 2018-10-03 : 17:56
 * following  css-tricks  tutorial:
   https://css-tricks.com/gulp-for-beginners/
 **/


// Gulp.js configuration
var gulp = require('gulp');  
var sass = require('gulp-sass'); // Requires the gulp-sass plugin
var browserSync = require('browser-sync').create(); //run/sync browser
var useref = require('gulp-useref'); // compiles js/scss as per inlien comments
var uglify = require('gulp-uglify'); //minify
var gulpIf = require('gulp-if'); // conditonal
var cssnano = require('gulp-cssnano'); // minify css
var imagemin = require('gulp-imagemin'); // minify images
var cache = require('gulp-cache'); // cache minified images
var del = require('del'); //delete files
var runSequence = require('run-sequence'); //makes sure they run in order

var  isVerbose = true;

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
  .pipe(gulp.dest('dist/assets/fonts'))
})

//images without caching
gulp.task('images', function(){
  return gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(imagemin({
      interlaced: true
    }))
  .pipe(gulp.dest('dist/assets/images'))
});

//images with caching
// gulp.task('images', function(){
//   return gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
//   // Caching images that ran through imagemin
//   .pipe(cache(imagemin({
//       interlaced: true
//     })))
//   .pipe(gulp.dest('dist/assets/images'))
// });


gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('sass', function() {
  return gulp.src('app/styles/root.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('hello', function() {
  console.log('Sod off, wanker!');
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

// gulp.task('watch', ['browserSync'], function (){
//   gulp.watch('app/scss/**/*.scss', ['sass']); 
//   gulp.watch('app/*.html', browserSync.reload); 
//   gulp.watch('app/js/**/*.js', browserSync.reload); 
//   // Other watchers
// })

// Gulp watch syntax
//gulp.watch('app/styles/**/*.scss', ['sass']); 

// default task
//gulp.task('default', ['watch']);

gulp.task('watch', ['build'], function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})


/** Notes ==============
 * build task works
 * watch task works runs but not oicking uo changes
 * watch not updating to dist
 * not renming root.css to main.css
 * building 'dist*html' dir
 * building 'dist/css/main.css' dir
 **/