module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			javascript: {
				src: ['src/phelem.main.js', 'src/phelem.event.js', 'src/phelem.*.js'],
				dest: 'build/phelem.js',
			},
		},
		uglify: {
			javascript: {
				files: {
					'build/phelem.min.js': ['build/phelem.js'],
				},
			},
		},
		watch: {
			javascript: {
				files: ['src/*.js'],
				tasks: ['concat:javascript', 'uglify:javascript'],
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['concat', 'uglify', 'watch']);
};
