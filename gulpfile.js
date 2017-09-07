var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify'); 
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

//--------------- Static server----------------------//
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: 'build'
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

//--------------------Gulp Compile---------------------------//
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/templates/index.pug')
  .pipe(pug({
        pretty: true
  }))
  .pipe(gulp.dest('build'))
});

gulp.task('js', function(){
     return gulp.src(
         [
             'source/js/main.js',
             'source/js/form.js'
         ]
     )
     .pipe(sourcemaps.init())
     .pipe(concat('main.min.js'))
     .pipe(uglify())
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('build/js'));
});
//-------------------Style Compile----------------------------//

gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(rename('main.min.css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

//------------------Sprite-------------------------------------//

gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));

  cb();
});

//------------------Rimraf--------------------------------------//
gulp.task('clean', function del(cb){
     return rimraf('build', cb);
});

//-----------------Copy Fonts---------------------------------//

gulp.task('copy:fonts', function(){
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

//-----------------Copy Images---------------------------------//

gulp.task('copy:images', function(){
    return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

//--------------------Copy-----------------------------------//

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

//-------------------Watchers---------------------------------//

gulp.task('watch', function(){
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.js', gulp.series('js'));
});

//------------------Default-------------------------------------//

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'js' ,'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));