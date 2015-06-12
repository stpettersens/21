/*
	Combine Blackjack scripts into one minified JavaScript file. 
*/
var gulp = require('gulp'),
	    fs = require('fs'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert'),
	uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src(['graphics.js','cards.js','card.js',
	'player.js','dealer.js','screentip.js','score.js','main.js'])
	.pipe(concat('blackjack.js'))
	.pipe(gulp.dest('dist'))
	.pipe(rename('blackjack.min.js'))
	.pipe(uglify())
	.pipe(insert.prepend('/*\nBlackjack\nCopyright 2015 Sam Saint-Pettersen'
	 + '\nReleased under the MIT/X11 License.'
	 + '\nhttps://github.com/stpettersens/21\n*/\n'))
	.pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
	var html = '<!DOCTYPE html>\n<head>' +
	'\n<title>HTML5 Blackjack<\/title>\n' +
	'<script type="text/javascript" src="blackjack.min.js"></script>\n' +
	'</head>\n<body>\n<h3 style="text-align: center;">HTML5 Blackjack</h3>\n' +
	'<canvas id="blackjack-table"></canvas>\n</body>\n</html>\n';
	fs.writeFileSync('index.html', html);
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	fs.unlinkSync('dist/blackjack.min.js');
	fs.unlinkSync('dist/blackjack.js');
	fs.unlinkSync('dist/index.html');
	fs.unlinkSync('index.html');
	fs.rmdir('dist');
});

gulp.task('default', ['js','html'], function(){});
