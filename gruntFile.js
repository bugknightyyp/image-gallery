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
  /*˼·˵�����Ƚ�js��css��ȡid������ת����cmdģ�飬
  �ٺϲ���Ҫ�ϲ����ļ���
  �ϲ�������������ļ�����Ե�ַ�ͻᷢ���ı䣬��ô��Ҫ���������·����
  ѹ����������ļ���
  ������û�õ��ļ�*/

};