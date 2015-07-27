/*
	Combine Blackjack (TypeScript) scripts into one minified JavaScript file. 
*/
var gulp = require('gulp'),
      fs = require('fs'),
     tsc = require('gulp-typescript'),
 typedoc = require('gulp-typedoc'),
  rename = require('gulp-rename'),
  insert = require('gulp-insert'),
  uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src('main.ts')
	.pipe(tsc({
		noImplicitAny: true,
		removeComments: true,
		out: 'blackjack.ts.js'
	}))
	.pipe(gulp.dest('dist'))
	.pipe(rename('blackjack.min.ts.js'))
	.pipe(uglify())
	.pipe(insert.prepend('/*\nBlackjack (TypeScript build).\nCopyright 2015 Sam Saint-Pettersen'
	 + '\nReleased under the MIT/X11 License.'
	 + '\nhttps://github.com/stpettersens/21\n*/\n'))
	.pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
	var html = '<!DOCTYPE html>\n<head>' +
	'\n<title>HTML5 Blackjack<\/title>\n' +
	'<script type="text/javascript" src="blackjack.min.ts.js"></script>\n' +
	'</head>\n<body>\n<h3 style="text-align: center;">HTML5 Blackjack (TypeScript build)</h3>\n' +
	'<canvas id="blackjack-table"></canvas>\n</body>\n</html>\n';
	fs.writeFileSync('index.html', html);
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('doc', function() {
	return gulp.src('*.ts')
	.pipe(typedoc({
		out: './doc',
		json: './doc/doc.json'
	}));
});

gulp.task('clean', function() {
	fs.unlinkSync('dist/blackjack.min.ts.js');
	fs.unlinkSync('dist/blackjack.ts.js');
	fs.unlinkSync('dist/index.html');
	fs.unlinkSync('index.html');
	fs.rmdir('dist');
});

gulp.task('default', ['js','html'], function(){});
