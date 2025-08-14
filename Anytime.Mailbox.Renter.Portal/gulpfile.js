/// <binding AfterBuild='allBundleMinify' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/

//const delSync = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const less = require('gulp-less');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
//const log = require('fancy-log')


// bundle js

gulp.task('bundleJs', () => {
	// Minify and bundle JS
	return gulp.src('./wwwroot/assets/js/**/*.js')
		.pipe(concat('anytime.mailbox.renter.portal.js'))
		.pipe(gulp.dest('./wwwroot/assets/bundles'));
});

// minify js
gulp.task('minifyJs', () => {
	// Minify and bundle JS
	return gulp.src('./wwwroot/assets/bundles/anytime.mailbox.renter.portal.js')
		.pipe(concat('anytime.mailbox.renter.portal.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./wwwroot/assets/bundles'));
});

gulp.task('bundleCss', () => {
	// Minify and bundle JS
	return gulp.src('./wwwroot/assets/css/**/*.css')
		.pipe(concat('anytime.mailbox.renter.portal.css'))
		.pipe(gulp.dest('./wwwroot/assets/bundles'));
});

gulp.task('minifyCss', () => {
	// Minify and bundle JS
	return gulp.src('./wwwroot/assets/bundles/anytime.mailbox.renter.portal.css')
		.pipe(concat('anytime.mailbox.renter.portal.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./wwwroot/assets/bundles'));
});

gulp.task('jsBundleMinify', gulp.series('bundleJs', 'minifyJs'));
gulp.task('cssBundleMinify', gulp.series('bundleCss', 'minifyCss'));

gulp.task('allBundleMinify', gulp.parallel('jsBundleMinify', 'cssBundleMinify'));

// install node.js (nodejs.org)
	// downloads npm - used to download gulp
// run cmd, change directory to the project, run
//     npm init
//     npm install del gulp gulp-clean-css gulp-concat gulp-less gulp-rename gulp-uglify
