const path = require('path');

const del = require('del');
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const argv = require('yargs').argv;
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify-es').default;
const minifyCss = require('gulp-minify-css');
const insert = require('gulp-insert');
const connect = require('gulp-connect');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');

const dist = path.join(__dirname, 'dist');
const common = path.join(__dirname, 'common');
const project = path.join(__dirname, argv.project);

gulp.task('clean', function () {
    return del([dist]);
})

gulp.task('build', ['clean'], function () {
    gulp.src(path.join(project, 'img/**/*'))
        .pipe(gulp.dest(path.join(dist, 'img')));
    gulp.src(path.join(common, 'layout.ejs'))
        .pipe(ejs({
            title: argv.project,
            project: argv.project,
            project_dir: project
        }))
        .pipe(gulpif(!argv.production, insert.append(`<script>
            document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')
        </script>`)))
        .pipe(rename("index.html"))
        .pipe(usemin({
            path: project,
            css: [minifyCss(), 'concat'],
            js: [uglify(), 'concat'],
            html: [htmlmin({ collapseWhitespace: true })],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
    gulp.watch(path.join(common, '**/*'), ['build']);
    gulp.watch(path.join(project, '**/*'), ['build']);
});

gulp.task('serve', ['watch'], function () {
    connect.server({
        root: dist,
        livereload: true
    });
});