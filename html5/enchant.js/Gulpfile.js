/*
	Combine Blackjack (enchant.js) scripts into one minified JavaScript file. 
*/
var gulp = require('gulp'),
	    fs = require('fs'),
	concat = require('gulp-concat'),
	 jsdoc = require('gulp-jsdoc'),
	rename = require('gulp-rename'),
   replace = require('gulp-replace'),
	insert = require('gulp-insert'),
	uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src(['graphics.js','debug.js','cards.js','card.js',
	'screentip.js','score.js','player.js','dealer.js','ai.js','main.js'])
	.pipe(concat('blackjack.js'))
	.pipe(gulp.dest('dist'))
	.pipe(rename('blackjack.min.js'))
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
	'<script type="text/javascript" src="//cdn.jsdelivr.net/enchantjs/0.8.1/enchant.min.js"></script>\n' +
	'<script type="text/javascript" src="blackjack.min.js"></script>\n' +
	'</head>\n<body>\n<h3 style="text-align: center;">HTML5 Blackjack' +
	' (<a href="http://enchantjs.com">enchant.js</a> build)</h3>\n' +
	'<div id="enchant-stage"></div>\n' +
	'<p style="font-size: 11pt; text-align: center;">\n' +
	'Press Escape key to <a href="https://github.com/stpettersens/21">visit project</a>\n' +
	' on Github.<br/><br/>\n' +
	'Cards courtesy of <a href="http://www.jfitz.com/cards">Jfitz.com</a>.\n' +
	'</p>\n</body>\n</html>\n';
	fs.writeFileSync('index.html', html);
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('graphics', function() {
	return gulp.src(['graphics/*.png'])
	.pipe(gulp.dest('dist/graphics'));
});

gulp.task('doc', function() {
	return gulp.src('*.js')
	.pipe(jsdoc('./doc'));
});

gulp.task('clean', function() {
	fs.unlinkSync('dist/blackjack.min.js');
	fs.unlinkSync('dist/blackjack.js');
	fs.unlinkSync('dist/index.html');
	fs.unlinkSync('index.html');
	fs.rmdir('dist');
	fs.rdmir('doc');
});

gulp.task('default', ['js','html','graphics'], function(){});
gulp.task('debug', ['default','debug-on'], function(){});
