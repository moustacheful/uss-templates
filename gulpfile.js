var gulp			= require('gulp'),
	stylus			= require('gulp-stylus'),
	watch			= require('gulp-watch'),
	prefix			= require('gulp-autoprefixer'),
	coffee			= require('gulp-coffee'),
	livereload		= require('gulp-livereload'),
	rename			= require('gulp-rename'),
	cssmin			= require('gulp-cssmin'),
	sourcemaps		= require('gulp-sourcemaps'),
	plumber			= require('gulp-plumber'),
	concat			= require('gulp-concat'),
	processhtml		= require('gulp-processhtml'),
	uglify			= require('gulp-uglify'),
	html2js			= require('gulp-html2js'),
	notify			= require('gulp-notify'),
	ngAnnotate		= require('gulp-ng-annotate'),
	nodemon		= require('gulp-nodemon')

var paths = {
	bower: './bower_components',
	server: {
		dev: './src',
		dist: './'
	},
	front: {
		dev: './dev',
		dist: './public/...'
	}
}

gulp.task('watch', function() {
	livereload.listen();
	watch({glob:paths.front.dev + '/css/**/*.css'}).on('change',livereload.changed);
	
	watch({glob:paths.front.dev + '/stylus/**/*.styl'}, function(files){
		gulp.start('build:css')
	})
	watch({glob:paths.server.dev + '/**/*.coffee'}, function(files){
		gulp.start('build:server')
	}) 
	nodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
    .on('restart', function () {
    	notify('Server up!')
    	console.log('Server up!');
    })

	watch({glob:paths.front.dev + '/coffee/**/*.coffee'}, function(files){
		gulp.start('build:coffee')
	}) 
});

gulp.task('build', [
	'build:coffee',
	'copy:js:app',
	'copy:js:thirdparty',
	'build:css',
	'copy:css',
	'copy:images',
	//'copy:png',
	'copy:etc',
	'processhtml'
])

gulp.task('build:templates', function() {
	gulp.src(paths.front.dev + '/partials/**/*.html')
		.pipe(html2js({
			outputModuleName: 'app.templates'
		}))
		.pipe(concat('app.templates.js'))
		.pipe(gulp.dest(paths.front.dev + '/js'))
		.pipe(notify('Templates compiled'))
})

gulp.task('build:server', function() {
	gulp.src([
		paths.server.dev + '/server.coffee',
		paths.server.dev + '/schema/**/*.coffee',
		paths.server.dev + '/routes/**/*.coffee'
	])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('server.js'))
		.pipe(coffee())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.server.dist))
		.pipe(notify('Server coffee compiled'))
})

gulp.task('build:coffee', function() {
	gulp.src([
		paths.front.dev + '/coffee/app.coffee',
		paths.front.dev + '/coffee/controllers/**/*.coffee',
		paths.front.dev + '/coffee/directives/**/*.coffee',
		paths.front.dev + '/coffee/filters/**/*.coffee',
		paths.front.dev + '/coffee/services/**/*.coffee'
	])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(coffee())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.front.dev + '/js'))
		.pipe(notify('Coffee compiled'))
})
gulp.task('build:css', function() {
	gulp.src(paths.front.dev + '/stylus/core.styl')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(prefix())
		.pipe(sourcemaps.write())
		.pipe(rename('styles.css'))
		.pipe(gulp.dest(paths.front.dev + '/css/'))
		.pipe(notify('Stylus compiled'))
})

gulp.task('copy:etc', function() {
	gulp.src([
		paths.front.dev + '/**/*.php',
	]).pipe(gulp.dest(paths.front.dist));
})
gulp.task('copy:images', function() {
	gulp.src([
		paths.front.dev + '/images/**/*.jpg',
		paths.front.dev + '/images/**/*.gif',
	], {
		base: paths.front.dev
	})
		.pipe(gulp.dest(paths.front.dist));
});
gulp.task('copy:png', function() {
	gulp.src(paths.front.dev + '/**/*.png', {
		base: paths.front.dev
	})
		.pipe(imagemin({
			progressive: true,
			pngquant: true
		}))
		.pipe(gulp.dest(paths.front.dist))
});
gulp.task('copy:css', function() {
	gulp.src(paths.front.dev + '/css/**/*.css', {
		base: paths.front.dev
	})
		.pipe(cssmin())
		.pipe(gulp.dest(paths.front.dist))
});
gulp.task('copy:js:app', function() {
	gulp.src(paths.front.dev + '/js/*.js')
		.pipe(concat('app.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest(paths.front.dist + '/js'))
});
gulp.task('copy:js:thirdparty', function() {
	gulp.src(jsThirdParty)
		.pipe(concat('modules.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.front.dist + '/js'))
})
gulp.task('processhtml', function() {
	gulp.src(paths.front.dev + '/index.html')
		.pipe(processhtml('index.html'))
		.pipe(gulp.dest(paths.front.dist))
})