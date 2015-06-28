module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserSync: {
      bsFiles: {
        src : [
          './**/*.js',
          './**/*.xml',
          './**/*.css'
        ]
      },
      options: {
        watchTask: false,
        open: false,
        server: {
            baseDir: "./"
        }
      }
    }
  });    
  
  // Load the plugin that provides the "browserSync" task.
  grunt.loadNpmTasks('grunt-browser-sync');

  // Default task(s).
  grunt.registerTask('default', ['browserSync']);
};