module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	transport:{
	    options :{
		   idleading:'<%= pkg.name %>/<%= pkg.version %>/',
		   debug:true
	    },
	   chain :{
        files: [{
          expand: true,
                cwd: 'src',
                src: '*.js',
                dest: 'temp'
            }]
	   }
	},
	uglify: {
		options: {
		 banner: '/*! <%= pkg.name %> -v <%= pkg.version%>  <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			//cwd:"dist"
		},
		build: {
			files:{
				"dist/<%= pkg.name %>.cmd.js":["temp/*.cmd.js"],
				"dist/<%= pkg.name %>.js":["src/<%= pkg.name %>.js"]
			}
      }
    }
	
  });


  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-cmd-transport');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // Default task(s).
  grunt.registerTask('default', ['transport',"concat","correct","uglify","clean"]);
  /*思路说明：先将js，css提取id和依赖转换成cmd模块，
  再合并需要合并的文件，
  合并后，相对依赖的文件的相对地址就会发生改变，那么就要纠正下相对路径，
  压缩了所需的文件后，
  最后清除没用的文件*/

};