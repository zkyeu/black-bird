/*
 * 51Talk 自动化工程管理
 */

'use strict';
/* 基础组件 */
var gulp		= require('gulp-param')(require('gulp'), process.argv);
var	ejs 		= require("gulp-ejs");
//css
var	header 		= require('gulp-header');
var	less 		= require("gulp-less");
var	autoprefix 	= require('gulp-autoprefixer');
var	makeUrlVer 	= require('gulp-make-css-url-version');
//images
var imagemin    = require('gulp-imagemin');
//js
var concat      = require('gulp-concat');
var uglify		= require('gulp-uglify');
var transport	= require('gulp-seajs-transport');
//base
var plumber		= require('gulp-plumber');
var	browserSync = require('browser-sync');
var changed	    = require('gulp-changed');
var html2js 	= require('gulp-html2js');
// var debug       = require('gulp-debug');
var	reload 		= browserSync.reload;

/* banner info */
var pkg = require('./package.json');
var banner = ['/*!',
    ' * <%= pkg.homepage %>',
    ' * copyright (c) 2015 <%= pkg.name %>',
    ' * author: <%= pkg.author %>',
    //' * update: <%= new Date() %>',
    ' */',
    ''].join('\n');


/* gulp js 任务 */
gulp.task('js', function (project, type) {
    var jsfile = gulp.src([
        'js/'+type+'/project/'+project+'/*.js',
        '!js/'+type+'/project/'+project+'/config.js',
    ]).pipe(plumber());

    if(project==="b2s" && type==="wap") jsfile = jsfile.pipe(transport());
    jsfile.pipe(changed('templates/js', {extension: '.js'}))
    .pipe(uglify({
        output: {
            ascii_only: true
        }
    }).on("error", function (err) {
        console.log(err);
    }))
    .pipe(gulp.dest('templates/js'));
});

/* gulp css/less 任务 */
gulp.task('less', function(project, type) {
    return gulp.src('less/'+type+"/"+project+'/*.less')
    .pipe(changed('templates/css/', {extension: '.css'}))
    .pipe(header(banner, {pkg:pkg}))
    .pipe(less({compress:false})).on('error', function(event){console.log(event);})
    .pipe(autoprefix())
    .pipe(makeUrlVer())
    // .pipe(makeUrlVer({useDate:true}))
    .pipe(gulp.dest('templates/css/'))
    .on("end",function(){
        gulp.src('less/'+type+"/"+project+'/*.less')
        .pipe(changed('templates/css/', {extension: '.css'}))
        .pipe(header(banner, {pkg:pkg}))
        .pipe(less({compress:true})).on('error', function(event){console.log(event);})
        .pipe(autoprefix())
        .pipe(makeUrlVer())
        // .pipe(makeUrlVer({useDate:true}))
        .pipe(gulp.dest('templates/css/'))
        .pipe(reload({stream:true}));
    });
});

/* images 任务 */
gulp.task('images', function(project, type){
    return gulp.src('images/'+type+"/"+project+'/*.{jpg,png,gif,swf}')
    .pipe(changed('templates/images/'))
    .pipe(imagemin({
        progressive: true,
    }))
    .pipe(gulp.dest('templates/images/'));
});

/* html/templates 任务 */
gulp.task('html', function(project, type) {
    return gulp.src('ejs/'+type+"/"+project+'/*.ejs')
    .pipe(changed('templates/'+type, {extension: '.html'}))
    .pipe(ejs({
        csslinkb2s : "../css/",
        imagessrc: "../images/",
        jssrc: "../js/vendor.js"
    }))
    .pipe(gulp.dest('templates/'+type)).on("end",function(){
        gulp.src('ejs/'+type+"/"+project+'/*.ejs')
        .pipe(changed('templates/'+type, {extension: '.html'}))
        .pipe(ejs({
            csslinkb2s : "../css/",
            imagessrc: "../images/",
            jssrc: "../js/vendor.js"
        }))
        .pipe(gulp.dest('templates/'+type))
    });
});
//
// gulp.task('html2js', function (project, type) {
//     return gulp.src('templates/' + type + '/*.html2js.html')
//     .pipe(changed('js/'+type+'/project/'+project, {extension: '.js'}))
//     .pipe(html2js('html2js.js', {
//         adapter: 'javascript',
//         base: 'templates',
//         name: 'html2js'
//     }))
//     .pipe(gulp.dest('js/'+ type + '/project/' + project)).on('end',function(){
//         return gulp.src('templates/js/html2js.js')
//         .pipe(changed('templates/js/', {extension: '.js'}))
//         .pipe(uglify({output: {ascii_only: true}}))
//         .pipe(gulp.dest('templates/js'));
//     });
// });



gulp.task('html2js', function (project, type) {
    return gulp.src('templates/'+ type +'/*.html2js.html')
        .pipe(changed('js/'+type+'/project/'+project, {extension: '.js'}))
        .pipe(html2js('html2js.js', {
            adapter: 'javascript',
            base: 'templates',
            name: 'html2js'
        }))
        .pipe(gulp.dest('js/'+type+'/project/'+project)).on('end',function(){
            return gulp.src('js/'+type+'/project/'+project+'/html2js.js')
                .pipe(changed('templates/js/', {extension: '.js'}))
                .pipe(uglify({
                    output: {
                        ascii_only: true
                    }
                }))
                .pipe(gulp.dest('templates/js/'));
        });
});

/* browser sync */
gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: '.',
            directory: true
        },
        open: 'external',
        startPath: 'templates'
    });
});
//browser reload
gulp.task('bs-reload', function(){
    browserSync.reload();
});
/* gulp 全部任务执行一次 */
gulp.task('all', function(project, type){
    gulp.run('images', 'less', 'js', 'html', 'html2js');
});

/* gulp 监控任务 */
gulp.task('watch', ['browser-sync'], function(project, type){
    gulp.watch(['ejs/'+type+"/"+project+'/*.ejs'], ['html', 'bs-reload']);
    gulp.watch(['templates/'+type+'/*.html2js.html'], ['html2js', 'bs-reload']);
    gulp.watch(['less/'+type+"/"+project+'/*.less'], ['less', 'bs-reload']);
    gulp.watch(['images/'+type+"/"+project+'/*.{jpg,png,gif,swf}'], ['images', 'bs-reload']);
    gulp.watch(['js/'+type+'/project/'+project+'/*.js','!js/'+type+'/project/'+project+'/vendor.js'], ['js', 'bs-reload']);
});

/* gulp default */
gulp.task('default', function () {
    console.log("Wecome to project for Study Report");
    console.log("You can run gulp watch --project PROJECT_NAME to start project");
});