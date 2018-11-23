/*
	声明任务
*/
var gulp = require("gulp");


/*
	拷贝HTML力的文件
	第一个参数：任务的名字
	第二个参数：这个任务所要执行的具体步骤
*/
gulp.task("copy-html",function(){
	/*
		html/*.html  找到HTML文件夹下，所有后缀为.html的文件
		gulp.src() 查找源文件路径
		pipe() 管道，任务要执行的时候要通过管道来执行
		gulp.dest() 存放的目录路径（可以有没有文件目录，如果没有，就会自己创建）
	*/
	return gulp.src("html/*.html")
	.pipe(gulp.dest("dist"))
	.pipe(connect.reload());
})


/*
	图片的拷贝
*/
gulp.task("images",function(){
	return gulp.src("images/*.{jpg,png}")
	.pipe(gulp.dest("dist/images"))
	.pipe(connect.reload());
})

// const imagemin = require('gulp-imagemin');

// gulp.task('imagemin', () =>
// 	gulp.src('images/*.{jpg,png}')
// 		.pipe(imagemin())
// 		.pipe(gulp.dest('dist/images1'))
// );

/*编译scss文件
gulp-scss插件*/
// 引入插件
// var scss = require("gulp-scss");
// gulp.task("scss",function(){
// 	return gulp.src("scss/*.scss")
// 	.pipe(scss())
// 	.pipe(gulp.dest("dist/css"));
// })


// var gulp = require('gulp');
var sass = require('gulp-sass');
// sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('scss/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./dist/css'))
  .pipe(connect.reload());
});

// 拷贝js文件
gulp.task("scripts",function(){
	return gulp.src("js/*.js")
	.pipe(gulp.dest("dist/js"))
	.pipe(connect.reload());
})

// 拷贝data文件
gulp.task("data",function(){
	return gulp.src("data/*.json")
	.pipe(gulp.dest("dist/data"))
	.pipe(connect.reload());
})


gulp.task("builder",["copy-html","images","sass","scripts","data"],function(){
	// return gulp.src("data/*.json")
	// .pipe(gulp.dest("dist/data"));
	console.log("编译成功");
})

/*
	gulp监听文件
*/
gulp.task("watch",function(){
	gulp.watch("html/*.html",["copy-html"]);
	gulp.watch("images/*.{jpg,png}",["images"]);
	gulp.watch("scss/*.scss",["sass"]);
	gulp.watch("js/*.js",["scripts"]);
	gulp.watch("data/*.json",["data"]);
})

/*
	gulp-connect
*/

var connect = require("gulp-connect");
gulp.task("connect",function(){
/*
	我们启动临时服务器
	自动刷新功能
*/
	connect.server({
		root:"dist",  //以哪个文件夹为服务器的根目录
		port:8888, //设置服务器的端口号
		livereload: true, //设置当前可以自动刷新
		host: '192.168.0.101'
	})
	
})


gulp.task("default",["watch","connect"]);