/*
	Combine Blackjack (enchant.js) scripts into one minified JavaScript file.
*/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/* <%=pkg.name %> */\n'
			},
			build: {
				src: ['graphics.js','sounds.js,debug.js','cards.js','card.js','screentip.js','score.js','player.js','dealer.js','ai.js','main.js'],
				dest: 'dist/blackjack.enchant_js.min.js'
			}
		}
	})

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};
