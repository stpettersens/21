/*
	Combine Blackjack (CoffeeScript) scripts into one minified 
	JavaScript file.
*/
var gulp = require('gulp'),
      fs = require('fs'),
   gutil = require('gutil'),
  coffee = require('gulp-coffee'),
    codo = require('gulp-codo'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  insert = require('gulp-insert'),
  uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src(['graphics.coffee','sounds.coffee','cards.coffee','card.coffee','player.coffee','dealer.coffee',
	'ai.coffee','screentip.coffee','score.coffee','debug.coffee','main.coffee'])
	.pipe(concat('blackjack.coffee'))
	.pipe(coffee({bare: true}).on('error', gutil.log))
	.pipe(gulp.dest('dist'))
	.pipe(rename('blackjack.min.coffee.js'))
	.pipe(uglify())
	.pipe(insert.prepend('/*\nBlackjack (CoffeeScript build).\nCopyright 2015 Sam Saint-Pettersen'
	 + '\nReleased under the MIT/X11 License.'
	 + '\nhttps://github.com/stpettersens/21\n*/\n'))
	.pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
	var html = '<!DOCTYPE html>\n<head>' +
	'\n<title>HTML5 Blackjack<\/title>\n' +
	'<script type="text/javascript" src="bower_components/enchant/enchant.min.js"></script>\n' +
	'<script type="text/javascript" src="blackjack.min.coffee.js"></script>\n' +
	'</head>\n<body onload="init();">\n<h3 style="text-align: center;">HTML5 Blackjack ' +
	'(<a href="http://enchantjs.com">enchant.js</a> build)</h3>\n' +
	'<div id="enchant-stage"></div>\n' +
	'<p style="font-size: 11pt; text-align: center;">\n' +
	'Press Escape key to <a href="https://github.com/stpettersens/21">visit project</a>\n' +
	' on Github.<br/><br/>\nSound effects courtesy of <a href="https://www.youtube.com/audiolibrary/' +
	'soundeffects">YouTube Audio Library</a>. Cards courtesy of <a href="http://www.jfitz.com/cards">' +
	'Jfitz.com</a>.\n</body>\n</html>\n';
	fs.writeFileSync('index.html', html);
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('lib', function() {
	return gulp.src(['bower_components/enchant/enchant.js'])
	.pipe(concat('bower_components/enchant/enchant.min.js'))
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
	return gulp.src('*.coffee')
	.pipe(codo({
		name: 'Blackjack',
		title: 'Blackjack documentation'
	}));
});

gulp.task('clean', function() {
	fs.unlinkSync('dist/blackjack.min.coffee.js');
	fs.unlinkSync('dist/blackjack.js');
	fs.unlinkSync('dist/graphics.min.coffee.js');
	fs.unlinkSync('dist/graphics.js');
	fs.unlinkSync('dist/index.html');
	fs.unlinkSync('index.html');
	fs.rmdir('dist');
});

gulp.task('default', ['js','html','lib','graphics','sounds'], function(){});
