const { src, dest, parallel, series, watch } = require('gulp')

const sass           = require('gulp-sass')
const browserSync    = require('browser-sync').create()
const concat         = require('gulp-concat')
const terser         = require('gulp-terser')
const cleanCSS       = require('gulp-clean-css')
const del            = require('del')
const imagemin       = require('gulp-imagemin')
const newer          = require('gulp-newer')
const cache          = require('gulp-cache')
const autoprefixer   = require('gulp-autoprefixer')
const bourbon        = require('node-bourbon')
const notify         = require("gulp-notify")
const spritesmith	 = require('gulp.spritesmith')
const svgSprite      = require('gulp-svg-sprites')
const sourcemaps 	 = require('gulp-sourcemaps')
const rev            = require('gulp-rev')
const revReplace     = require('gulp-rev-replace')
const ftp            = require('vinyl-ftp')
const gutil          = require('gulp-util')

function scripts () {
	return src ([
		// 'app/libs/jquery/dist/jquery.min.js',
        // 'app/libs/slimmenu-master/dist/js/jquery.slimmenu.min.js',
        // 'app/libs/wow/wow.min.js',
        //'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        //'app/libs/owl.carousel/dist/owl.carousel.min.js',
        //'app/libs/jquery.ellipsis-master/jquery.ellipsis.min.js',
        //'app/libs/jQueryFormStyle/jquery.formstyler.min.js',
        //'app/libs/malihu-custom-scrollbar-plugin-master/jquery.mCustomScrollbar.concat.min.js',
        //'app/libs/snap.svg/snap.svg-min.js',
		//'app/libs/TouchSwipe/jquery.touchSwipe.min.js',
		//'app/libs/cropbox/jquery.cropbox.js',
		//'app/libs/exif.js/exif.js',
		//'app/libs/clipboard.js/dist/clipboard.min.js',
		// 'app/libs/mixtup/mixitup.min.js',
		'app/libs/Gsap/gsap.min.js',
		'app/libs/micromodal/micromodal.min.js',
		'app/libs/Swiper/swiper-bundle.min.js',

		'app/js/common.js'
	])
	.pipe(concat('scripts.min.js'))
	.pipe(terser())
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function spritepng () {
	var spriteData = src('app/img/for-sprite-png/*.png').pipe(spritesmith({
        imgName: 'sprite-png.png',
        cssName: '_sprite-png.scss',
        padding: 10
    }));
    return spriteData.pipe(dest('app/img'));
}

function spritesvg () {
	return src('app/img/for-sprite-svg/*.svg')
	.pipe(svgSprite({
		mode: "symbols"
	}))
	.pipe(dest("app/img/"));
}

function browsersync () {
    browserSync.init({
        server : { baseDir : 'app/' },
        notify : false, // отключение уведомления
        online : true // работа без wi-fi сети (false -- без wi-fi)
    })
}

function func_sass () {
	return src('app/sass/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: bourbon.includePaths
	}).on("error", notify.onError()))
	.pipe(concat('app.min.css'))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(sourcemaps.write('.'))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}
 
function func_imagemin () {
	return src(['app/img/**/*+(.png|jpg|jpeg|ico|gif)', '!app/img/for-sprite-svg/*', '!app/img/for-sprite-png/*'])
	.pipe(newer('app/img/**/*+(.png|jpg|jpeg|ico|gif)', '!app/img/for-sprite-svg/*', '!app/img/for-sprite-png/*'))
	.pipe(cache(imagemin()))
	.pipe(dest('dist/img'))
}

function revScript () {
	return src('app/js/scripts.min.js')
	.pipe(rev())
	.pipe(dest('dist/js'))
	.pipe(rev.manifest('js.json'))
	.pipe(dest('manifest'))
}
function revStyle () {
	return src('app/css/app.min.css')
	.pipe(rev())
	.pipe(dest('dist/css'))
	.pipe(rev.manifest('css.json'))
	.pipe(dest('manifest'))
}

function buildcopy () {
	return src([
		'app/**/*.html',
		'app/fonts/**/*',
		'app/*.htaccess',
		'app/*.php',
		'app/css/*.map',
		'app/img/**/*.svg'
	], {base : 'app'})
	.pipe(revReplace({ manifest: src('manifest/js.json') }))
	.pipe(revReplace({ manifest: src('manifest/css.json') }))
	.pipe(dest('dist/'))
}

function removedist () {
	return del('dist');
}

function clearcache () {
	return cache.clearAll();
}


function func_watch () {
	watch('app/sass/**/*.scss', func_sass)
	watch(['libs/**/*.js', 'app/js/common.js'], scripts)
    watch('app/**/*.html').on('change', browserSync.reload)
}
 
function deploy () {
	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
		'dist/**',
		'dist/*.htaccess',
	];
	return gulp.src(globs, {buffer: false})
		.pipe(conn.dest('/path/to/folder/on/server'));
}




exports.spritepng  = spritepng
exports.spritesvg  = spritesvg
exports.buildcopy  = buildcopy
exports.removedist = removedist
exports.clearcache = clearcache
exports.deploy = deploy

exports.build = series(removedist, func_imagemin, func_sass, scripts, revScript, revStyle, buildcopy)

exports.default = parallel(func_sass, scripts, browsersync, func_watch)
