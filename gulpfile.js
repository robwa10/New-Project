// This gulpfile.js was created by Robert Hubbard - www.roberthubbard.org
// It is largely based off of reasearch from the following sites
// https://css-tricks.com/gulp-for-beginners/
// https://semaphoreci.com/community/tutorials/getting-started-with-gulp-js
// https://www.sitepoint.com/simple-gulpy-workflow-sass/
//
// For more information on Gulp visit
// http://gulpjs.com/



var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gutil = require('gulp-util'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    sassdoc = require('gulp-sassdoc'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref');


var autoprefixerOptions = {browsers: ['last 3 versions', '>5%', 'Firefox ESR']},
    coffeeSources = ['dev/coffee/**/*.coffee'],
    htmlSources = ['dev/*.html'],
    jsSources = ['dev/js/**/*.js'],
    sassdocOptions = { dest: 'dist/sassdoc'},
    sassOptions = {errLogToConsole: true, outputStyle: 'expanded'},
    sassSources = ['dev/scss/*.scss'];

//  Spin up a local web server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dev' // Directory containg source files
        },
    })
});

// Clean unused files in the dist folder
gulp.task('clean:dist', function() {
   return del.sync('dist');
});

// Compile CoffeeScript files into JavaScript
gulp.task('coffee', function() {
   return gulp
    .src(coffeeSources) // Directory containing source files
    .pipe(coffee({bare:true})
         .on('error', gutil.log)) // Log errors
    .pipe(gulp.dest('dev/js')) // Destination folder
    .pipe(browserSync.reload({ // Inject new Javascript when 'coffee' is run
      stream: true
  }))
});

// Copy fonts
gulp.task('fonts', function() {
    return gulp
    .src('dev/fonts/**/*') // Directory containing source files
    .pipe(gulp.dest('dist/fonts')) // Destination folder
});

// Copy HTML files
gulp.task('html', function() {
    return gulp
    .src(htmlSources) // Directory containing source files
    .pipe(gulp.dest('dist')) // Destination folder
});

// Optimize images
gulp.task('images', function() {
   return gulp
    .src('dev/images/**/*.+(png|jpg|gif|svg)') // Directory containing source files
    .pipe(cache(imagemin())) // Cache photos run through imagemin
    .pipe(gulp.dest('dist/images'))
});

// Compile SASS into CSS
gulp.task('sass', function(){
  return gulp
    .src(sassSources)  // Directory containing source files
    .pipe(sourcemaps.init()) // Initializing sourcemaps
    .pipe(sass(sassOptions).on('error',sass.logError)) // Run Sass on files and log errors in the console
    .pipe(sourcemaps.write()) // Writing sourcemaps
    .pipe(autoprefixer(autoprefixerOptions)) // Autoprefixing before outputting CSS file
    .pipe(gulp.dest('dev/css')) // Destination folder
    .pipe(browserSync.reload({ // Inject new CSS styles when 'sass' is run
      stream: true
  }))
});

// Create SassDoc
gulp.task('sassdoc', function () {
  return gulp
    .src(sassSources) // Directory containing source files
    .pipe(sassdoc(sassdocOptions)) // Destination folder
    .resume();
});

// Concatenate and minify Javascript and CSS files
// For information on the concatenation process refer to https://www.npmjs.com/package/gulp-useref
gulp.task('useref', function () {
    return gulp
    .src(htmlSources) // Source HTML containing <script> tags
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Only minify if JS file
    .pipe(gulpIf('*.css', cssnano())) // Only minify if CSS file
    .pipe(gulp.dest('dist'))
});


/*
This is the task to run during the development phase. You can change it to default, it is my personal preference to have it as gulp watch.

It will do the following:
Compile SASS to CSS
Compile CoffeeScript into JavaScript
Spin up a local host web server with index.html
Watch for changes in .sass, .scss, .html, .coffee files
Reload the browser when changes are made
*/

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('dev/scss/**/*.+(scss|.sass)', ['sass']);

    // Remove the following line if you are not using CoffeeScript
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(htmlSources, browserSync.reload);

    /* If you are not using CoffeeScript the commented code reloads the browser when changes are made to JavaScript files */
    // gulp.watch(jsSources, browserSync.reload);
    gulp.on('change', function(event) {
        console.log('File' + event.path + 'was' +event.type + ', running tasks...');
        });
});


/*
This is the task to run during the production phase. You can change it to default, it is my personal preference to have it as gulp build.

It will do the following:
Clean the dist folder
Concatenate and minify JavaScript and CSS files
Optimize images
Copy all dependencies to dist folder
Create a Sassdoc in the dist folder
*/

gulp.task('build', function(callback) {
   runSequence('clean:dist', ['useref', 'images', 'fonts', 'html', 'sassdoc'], callback);
});
