var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('serve', function(){
    nodemon({
        script: 'server.js'
    });
});

gulp.task('default', gulp.series('serve'));
//关于如何使用gulp启动node app 
//https://www.cnblogs.com/can-i-do/p/7077497.html