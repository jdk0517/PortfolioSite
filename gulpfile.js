var gulp = require('gulp'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
    open = require('gulp-open'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minHTML = require('gulp-minify-html'),
    fileInclude = require('gulp-file-include');



/* dev server */
gulp.task('serve', function(){ //Connect server with livereload - dev
    return connect.server({
        port: 8080,
        root: 'dist',
        livereload: true
    });
});

gulp.task('launch', ['serve'], function() { //Launch the browser once our server is up
    return gulp.src('./dist/index.html')
    .pipe(open("./dist", {url: 'http://localhost:8080'}));
});

gulp.task('reload',function(){ //minitask to reload the page. need to do it this way because the connect.reload() function has to live inside a stream.
    return gulp.src('')
    .pipe(connect.reload());
});

gulp.task('styles',function(){
	return gulp.src('./src/scss/**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer())
    .pipe(minifyCSS())
	.pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts',function(){
    return gulp.src(['./src/bower_components/jquery/dist/jquery.min.js', '.src/bower_components/matchMedia/matchMedia.js', './src/scripts/main.js'])
    .pipe(concat({path: 'scripts.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'))
});

gulp.task('html', function(){
    return gulp.src('./src/*.html')
    .pipe(fileInclude({
        basepath: './src/_partials/'
    }))
    .pipe(minHTML())
    .pipe(gulp.dest('./dist'))
});


gulp.task('watch',function(){
	gulp.watch('./src/scss/**/*', ['styles', 'reload']);
	gulp.watch('./src/scripts/**/*.js', ['scripts','reload']);
	gulp.watch('./src/index.html', ['html','reload']);
})

gulp.task('default', ['styles', 'scripts', 'html', 'watch', 'launch']);