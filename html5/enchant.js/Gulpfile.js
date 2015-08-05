/*
	Combine Blackjack (enchant.js) scripts into one minified JavaScript file. 
*/
var gulp = require('gulp'),
	  fs = require('fs'),
	copy = require('gulp-copy'),
  concat = require('gulp-concat'),
   jsdoc = require('gulp-jsdoc'),
  rename = require('gulp-rename'),
 replace = require('gulp-replace'),
  insert = require('gulp-insert'),
  uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src(['graphics.js','sounds.js','debug.js','cards.js',
	'card.js','screentip.js','score.js','player.js','dealer.js',
	'ai.js','main.js'])
	.pipe(concat('blackjack.enchant_js.js'))
	.pipe(gulp.dest('dist'))
	.pipe(rename('blackjack.enchant_js.min.js'))
	.pipe(uglify())
	.pipe(insert.prepend('/*\nBlackjack (enchant.js build).\nCopyright 2015 Sam Saint-Pettersen'
	 + '\nReleased under the MIT/X11 License.'
	 + '\nhttps://github.com/stpettersens/21\n*/\n'))
	.pipe(gulp.dest('dist'));
});

gulp.task('debug-on', function() {
	return gulp.src('main.js')
	.pipe(replace(/(debug =) false/g, '$1 true'))
	.pipe(gulp.dest('.'));
});

gulp.task('html', function() {
	var html = '<!DOCTYPE html>\n<head>' +
	'\n<title>HTML5 Blackjack<\/title>\n' +
	'<script type="text/javascript" src="enchant.min.js"></script>\n' +
	'<script type="text/javascript" src="blackjack.enchant_js.min.js"></script>\n' +
	'</head>\n<body>\n<h3 style="text-align: center;">HTML5 Blackjack' +
	' (<a href="http://enchantjs.com">enchant.js</a> build)</h3>\n' +
	'<div id="enchant-stage"></div>\n' +
	'<p style="font-size: 11pt; text-align: center;">\n' +
	'Press Escape key to <a href="https://github.com/stpettersens/21">visit project</a>\n' +
	' on Github.\nSound effects courtesy of <a href="https://www.youtube.com/audiolibrary/soundeffects">YouTube Audio Library</a>.' +
	'<br/><br/>\n' + 'Cards courtesy of <a href="http://www.jfitz.com/cards">Jfitz.com</a>.\n' +
	'</p>\n</body>\n</html>\n';
	fs.writeFileSync('index.html', html);
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('lib', function() {
	return gulp.src(['enchant.js'])
	.pipe(concat('enchant.min.js'))
	.pipe(uglify())
	.pipe(insert.prepend('/* enchant.js v0.8.2 (http://enchantjs.com)\n' +
 	' * Copyright Ubiquitous Entertainment Inc.\n' +
 	' * Released under the MIT license. */\n'))
	.pipe(gulp.dest('dist'));
});

gulp.task('graphics', function() {
	return gulp.src(['graphics/*.png'])
	.pipe(gulp.dest('dist/graphics'));
});

gulp.task('sounds', function() {
	return gulp.src(['sounds/*.ogg'])
	.pipe(gulp.dest('dist/sounds'));
});

gulp.task('doc', function() {
	return gulp.src('*.js')
	.pipe(jsdoc('./doc'));
});

gulp.task('clean', function() {
	fs.unlinkSync('dist/blackjack.enchant_js.min.js');
	fs.unlinkSync('dist/blackjack.enchant_js.js');
	fs.unlinkSync('dist/index.html');
	fs.unlinkSync('index.html');
	fs.rmdir('dist');
	fs.rmdir('doc');
});

gulp.task('default', ['js','html','lib','graphics','sounds'], function(){});
gulp.task('debug', ['default','debug-on'], function(){});
