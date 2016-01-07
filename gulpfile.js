var gulp       = require('gulp'),
    less       = require('gulp-less'),
    path       = require('path'),
    browserSync= require("browser-sync"),
    uglify     = require('gulp-uglify'),
    minifycss  = require('gulp-minify-css'),
    plumber    = require('gulp-plumber'),
    concat     = require('gulp-concat'),
    imagemin   = require('gulp-imagemin'),
    pngquant   = require('imagemin-pngquant'),
    rename     = require("gulp-rename"),
    zip        = require('gulp-zip'),
    tinypng    = require('gulp-tinypng'),
    sftp       = require('gulp-sftp'),
    notify     = require('gulp-notify'),
    cache      = require('gulp-cache'),
    spriter    = require('gulp-spriter'),
    imageResize= require('gulp-image-resize'),
    minimist  = require('minimist'),
    gulpif     = require('gulp-if'),
    config     = require('./config.json'),
    srcPath    = {
      HTML : "./src/*.html",
      LESS : "./src/less/*.less",
      CSS : "./src/css",
      JS : "./src/js/*.js",
      IMG : "./src/images",
      SPRITE: "./src/images/slice",
      LIB : "./src/lib"
    },
    distPath   = {
      ROOT : "./dist",
      CSS : "./dist/css",
      JS : "./dist/js",
      IMG : "./dist/images"
    }

var options = minimist(process.argv.slice(2));

gulp.task("serve", ["less", "js-watch", "html"], function() {
    browserSync.init({
        server : "./src"
    });

    gulp.watch(srcPath.LESS, ["less"]);
    gulp.watch(srcPath.JS, ["js-watch"]);
    gulp.watch(srcPath.HTML, ["html"]);
    gulp.watch(srcPath.HTML).on("change", function() {
        browserSync.reload;
    });
});


gulp.task("less", function() {
    gulp.src(srcPath.LESS)
        .pipe(less())
        .pipe(gulp.dest(srcPath.CSS))
        .pipe(browserSync.stream());
})


gulp.task("js-watch", function() {
    gulp.src(srcPath.JS)
    .pipe(browserSync.stream());
})

gulp.task("html", function() {
    gulp.src(srcPath.HTML)
    .pipe(browserSync.stream());
})

gulp.task("default", ["serve"])



//压缩js css 文件，压缩后文件放入dist下   
gulp.task('minifyjs',function(){
    gulp.src(srcPath.JS)
    .pipe(uglify())
    .pipe(gulp.dest(distPath.JS))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(distPath.JS));
});

gulp.task('minifycss',function(){
    return gulp.src(srcPath.LESS)
          .pipe(less())
          .pipe(gulp.dest(srcPath.CSS))
          .pipe(minifycss())
          .pipe(gulp.dest(distPath.CSS));
});

// gulp.task('minifyspritePc',function(){
//     return gulp.src(srcPath.LESS)
//           .pipe(less())
//           .pipe(spriter({
//             sprite: "test.png",
//             slice: srcPath.SPRITE,
//             outpath: srcPath.IMG,
//             imgPathFromCss: "../images"
//           }))
//           .pipe(gulp.dest(srcPath.CSS))
//           .pipe(minifycss())
//           .pipe(gulp.dest(distPath.CSS));
// });
gulp.task('minifysprite',function(){
    return gulp.src(srcPath.LESS)
          .pipe(less())
          .pipe(spriter({
            sprite: "test.png",
            slice: srcPath.SPRITE,
            outpath: options.mb ? srcPath.SPRITE : srcPath.IMG,
            imgPathFromCss: "../images",
            isH5: options.mb
          }))
          .pipe(gulp.dest(srcPath.CSS))
          .pipe(minifycss())
          .pipe(gulp.dest(distPath.CSS));
});


//压缩图片
gulp.task('imagemin', ['scaleimg'], function () {
    return gulp.src(srcPath.IMG + '/*.{png,jpg,jpeg}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()] //深度png压缩
        })))
        .pipe(gulp.dest(distPath.IMG));
});

// 缩小图片 
gulp.task('scaleimg', function () {
  return gulp.src(srcPath.SPRITE + '/test.png')
    .pipe(gulpif(options.mb, imageResize({ 
      width: '50%',
      imageMagick: true
    })))
    .pipe(gulpif(options.mb, gulp.dest(srcPath.IMG)));
});

//压缩图片 - tinypng
gulp.task('tinypng', function () {
    gulp.src(srcPath.IMG + '/*.{png,jpg,jpeg}')
        .pipe(cache(tinypng(config.tinypngapi)))
        .pipe(gulp.dest(distPath.IMG));
});

//将相关项目文件复制到build 文件夹下
gulp.task('buildfiles', function() {
   gulp.src(srcPath.HTML)
   .pipe(gulp.dest(distPath.ROOT));
   gulp.src(srcPath.LIB)
   .pipe(gulp.dest(distPath.ROOT));
});


//项目完成提交任务
gulp.task('buildsprite', ['minifysprite'], function(){
  gulp.run('imagemin');
  gulp.run('minifyjs');
  gulp.run('buildfiles');
});


//项目完成提交任务
gulp.task('build', function(){
  gulp.run('imagemin');
  gulp.run('minifyjs');
  gulp.run('minifycss');
  gulp.run('buildfiles');
  
});

// //项目完成提交任务
// gulp.task('build2', function(){
//   gulp.run('tinypng');
//   gulp.run('minifyjs');
//   gulp.run('minifycss');
//   gulp.run('buildfiles');
// });

//打包主体build 文件夹并按照时间重命名
// gulp.task('zip', function(){
//       function checkTime(i) {
//           if (i < 10) {
//               i = "0" + i
//           }
//           return i
//       }
          
//       var d=new Date();
//       var year=d.getFullYear();
//       var month=checkTime(d.getMonth() + 1);
//       var day=checkTime(d.getDate());
//       var hour=checkTime(d.getHours());
//       var minute=checkTime(d.getMinutes());

//   return gulp.src('./build/**')
//         .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
//         .pipe(gulp.dest('./'));
// });

// //上传到远程服务器任务
// gulp.task('upload', function () {
//     return gulp.src('./build/**')
//         .pipe(sftp({
//             host: config.sftp.host,
//             user: config.sftp.user,
//             port: config.sftp.port,
//             key: config.sftp.key,
//             remotePath: config.sftp.remotePath
//         }));
// });

