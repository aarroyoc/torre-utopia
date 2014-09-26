module.exports=function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		typescript: {
			base: {
				src: ["index.ts","src/*.ts","src/**/*.ts"],
				dest: "index.js",
				options: {
					module: "commonjs",
					target: "es5"
				}
			}
		},
		browserify: {
			js: {
				src: "index.js",
				dest: "build/js/index.min.js"
			}
		},
		jade: {
			html: {
				files: {
					"build/html/" : ["jade/*.jade"]
				}
			},
			options: {
				client: false
			}
		},
		less: {
			dist: {
				options: {
					paths: ["less"],
					cleancss: true,
					banner: "<%= pkg.name %>"
				},
				files: {
					"build/css/main.css" : ["less/main.less"]
				}
			}
		},
		copy: {
			dist: {
				files: [
					{expand: true, cwd: "build/js", src: "*.js", dest: "build/dist/"},
					{expand: true, cwd: "build/css", src: "*.css", dest: "build/dist/css/"},
					{expand: true, cwd: "build/fonts", src: "*", dest: "build/dist/fonts"},
					{expand: true, cwd: "build/html", src: "*.html", dest: "build/dist/"},
					{expand: false, src: "conf/node-webkit.json", dest: "build/dist/package.json"},
					{expand: false, src: "conf/chrome-manifest.json", dest: "build/dist/manifest.json"},
					{expand: false, src: "conf/chrome-background.js", dest: "build/dist/background.js"},
					{expand: true, cwd: "conf", src: "manifest.webapp", dest: "build/dist/"}
				]
			}
		},
		"gh-pages" : {
			options: {
				base: "build/dist"
			},
			src: ["**"]
		},
		clean: {
			dist: ["build","index.js","src/**/*.js"]
		},
		connect: {
			server: {
				options: {
					port: 8080,
					base: "build/dist"
				}
			}
		},
		tsd: {
			refresh: {
				options: {
					command: "reinstall",
					latest: true,
					config: "tsd.json"
				}
			}
		},
		typedoc: {
			build: {
				options: {
					module: "commonjs",
					out: "build/docs",
					name: "<%= pkg.name %>",
					target: "es5"
				},
				src: ["index.ts","src/**/*.ts"]
			}
		},
		"release-it": {
			options: {
				pkgFiles: "package.json",
				commitMessage: "Release %s",
				tagName: "%s",
				tagAnnotation: "Release %s",
				buildCommand: false
			}
		},
		"local-googlefont": {
			"Ubuntu" : {
				options: {
					family: "Ubuntu",
					sizes: [
					300, 400, 700, 900
					],
					cssDestination: "build/css",
					fontDestination: "build/fonts",
					uri: "http://fonts.googleapis.com/css?family="
				}
			}
		},
		"html-validation": {
			options: {
				stoponerror: false
			},
			files: {
				src: ["build/dist/**/*.html"]
			}
		},
		"css-validation": {
			options: {
				stoponerror: false
			},
			files: {
				src: ["build/dist/**/*.css"]
			}
		},
		imagemin: {
			static: {
				options: {
					optimizationLevel: 7
				},
				files: [{
					expand: true,
					cwd: "build/dist",
					src: "**/*.{png,gif,jpeg,jpg}",
					dest: "build/dist"
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: "build/dist",
					src: "**/*.{html,htm}",
					dest: "build/dist"
				}]
			}
		},
		markedman: {
			options: {
				version: "<%= pkg.version %>",
				section: "6"
			},
			readme : {
				files: [
					{src: "README.md", dest: "build/man/<%= pkg.name %>.6"}
				]
			}
		},
		nodewebkit: {
			options: {
				platforms: ["win","osx","linux32","linux64"],
				buildDir: "build/node-webkit/"
			},
			src: "build/dist/**/*"
		},
		debian_package: {
			options: {
				maintainer: {
					name: "Adrián Arroyo Calle",
					email: "adrian.arroyocalle@gmail.com"
				},
				name: "<%= pkg.name %>",
				short_description: "<%= pkg.description %>",
				long_description: "<%= grunt.file.read('README.md') %>",
				version: "<%= pkg.version %>",
				build_number: "1"
			},
			files: [
				{
					expand: true,
					cwd: "build/node-webkit",
					src: ["**"],
					dest: "/opt/<%= pkg.name %>"
				},
				{
					expand: true,
					src: "/build/man/*",
					dest: "/usr/share/man/man6/"
				}
			]
		},
		favicons: {
			options: {
				windowsTile: true,
				coast: true,
				tileColor: "auto",
				trueColor: true,
				precomposed: true,
				appleTouchBackgroundColor: "#0080ff",
				tileBlackWhite: false,
				androidHomescreen: true,
				firefoxRound: true,
				firefox: true,
				appleTouchPadding: 0
			},
			icons: {
				src: "logo.svg",
				dest: "build/dist/icons/"
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: "build/css",
				src: ["*.css","!*.css"],
				dest: "build/dist/css",
				ext: ".min.css"
			}
		},
		compress: {
			firefoxos: {
				options: {
					archive: "<%= pkg.name %>-fxos.zip"
				},
				files: [
				{ expand: true, cwd: "build/dist/", src: "**", dest: ""}
				]
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-typescript");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-jade");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-gh-pages");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-tsd");
	grunt.loadNpmTasks("grunt-release-it");
	grunt.loadNpmTasks("grunt-local-googlefont");
	grunt.loadNpmTasks("grunt-pagespeed");
	grunt.loadNpmTasks("grunt-w3c-validation");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks("grunt-markedman");
	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.loadNpmTasks('grunt-debian-package');
	grunt.loadNpmTasks("grunt-favicons");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-typedoc");
	
	grunt.registerTask("default",["clean","tsd",/*"local-googlefont:Ubuntu",*/"typescript","browserify","jade","less","copy"]);
	grunt.registerTask("serve",["default","connect:server:keepalive"]);
	grunt.registerTask("docs",["typedoc","markedman"]);
	grunt.registerTask("publish",["default","favicons","htmlmin","imagemin","cssmin","release-it","gh-pages"]);
	grunt.registerTask("validation",["default","html-validation",/*"css-validation"*/]);
	grunt.registerTask("package",["default","favicons","htmlmin","imagemin","cssmin"/*,"nodewebkit"*/,"debian_package","compress:firefoxos"]);
	grunt.registerTask("test",["default","validation","docs"]);
}
