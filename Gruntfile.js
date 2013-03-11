module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    });

    grunt.registerTask('build', 'Build the script', function () {
        grunt.log.writeln('Build');
    });

    //grunt.registerTask('default', ['build']);
};
