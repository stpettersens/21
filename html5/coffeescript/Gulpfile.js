/*
	Combine Blackjack (CoffeeScript) scripts into two minified JavaScript files (logic and graphics).
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

gulp.task('graphics', function() {
	return gulp.src('graphics.coffee')
	.pipe(coffee({bare: true}).on('error', gutil.log))
	.pipe(gulp.dest('dist'))
	.pipe(rename('graphics.min.coffee.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
	return gulp.src(['cards.coffee','card.coffee','player.coffee','dealer.coffee',
	'screentip.coffee','score.coffee','debug.coffee','main.coffee'])
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
	'<script type="text/javascript" src="graphics.min.coffee.js"></script>\n' +
	'<script type="text/javascript" src="blackjack.min.coffee.js"></script>\n' +
	'</head>\n<body onload="init();">\n<h3 style="text-align: center;">HTML5 Blackjack  (CoffeeScript build)</h3>\n' +
	'<canvas id="blackjack-table"></canvas>\n</body>\n</html>\n';
	fs.writeFileSync('index.html', html);
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
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

gulp.task('default', ['graphics','js','html'], function(){});
