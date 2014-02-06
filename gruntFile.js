module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
      all: {
          options: {
            urls: [
              'http://localhost:<%= connect.server.options.port %>/test/independence.html'
            ]
          }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      basic: {
        options: {
          banner: 'var imageGallery = function() {',
          footer: '}'
        },
        src: ['src/init-parameters.js', 
            'src/init-structure.js',
            'src/get-model-params.js',
            'src/fresh-display-state.js',
            'src/auto-switch-screen.js',
            'src/preview-window.js',
            'src/preload-image.js',
            'src/event.js',
            'src/start.js'],
        dest: 'dist/image-gallery.js',
      },
      cmd: {
        options: {
          banner: 'define(function(require, exports, module){\n'
            +'var $ = require("jquery");\n'
            +'var imageGallery = function(options) {',
          footer: '}\n'
            +'  $.fn.imageGallery = imageGallery;\n'
            +'  module.exports = imageGallery;\n})'
        },
        src: "<%= concat.basic.src%>",
        dest: 'dist/image-gallery.js',
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      scripts: {
        files: 'src/*.js',
        tasks: ['concat:cmd']
      },
    }
	
  });


 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.loadNpmTasks('grunt-cmd-transport');
   
  grunt.registerTask('test', ['connect',"qunit"]);

};