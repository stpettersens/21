/*
	Combine Blackjack (enchant.js) scripts into one minified JavaScript file.
*/
module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			options: {
				banner: '/*\nBlackjack (enchant.js build).\n' +
				'Copyright 2015 Sam Saint-Pettersen' +
				'\nReleased under the MIT/X11 License.' +
				'\nhttps://github.com/stpettersens/21\n*/\n'
			},
			build: {
				src: ['graphics.js','sounds.js','debug.js','cards.js','card.js','screentip.js','score.js','player.js','dealer.js','ai.js','main.js'],
				dest: 'dist/blackjack.enchant_js.min.js'
			}
		}
	})

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};
