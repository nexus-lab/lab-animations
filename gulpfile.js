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
console.log(argv)
const project = argv.project ? path.join(__dirname, argv.project) : '';

gulp.task('clean', function () {
    return del([dist, dist + '-production']);
});

gulp.task('build', gulp.series('clean', function (done) {
    gulp.src(path.join(project, 'img/**/*')).pipe(gulp.dest(path.join(dist, 'img')));
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
    done();
}));

gulp.task('build-production', function (done) {
    gulp.src(path.join(project, 'img/**/*'))
        .pipe(gulp.dest(path.join(dist + '-production/', argv.project, 'img')));
    gulp.src(path.join(common, 'layout.ejs'))
        .pipe(ejs({
            title: argv.project,
            project: argv.project,
            project_dir: project
        }))
        .pipe(gulpif(!argv.production, insert.append(`<style>
        body {
            margin: 0;
            background: white;
        }
        #playground {
            margin: 0;
            box-shadow: none;
            border: 1px solid #ccc;
        }
        </style>`)))
        .pipe(rename("index.html"))
        .pipe(usemin({
            path: project,
            css: [minifyCss(), 'concat'],
            js: [uglify(), 'concat'],
            html: [htmlmin({ collapseWhitespace: true })],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest(path.join(dist + '-production/', argv.project)));
    done();
});

gulp.task('watch', gulp.series('build', function (done) {
    gulp.watch(path.join(common, '**/*'), gulp.series('build'));
    gulp.watch(path.join(project, '**/*'), gulp.series('build'));
    done();
}));

gulp.task('serve', gulp.series('watch', function (done) {
    connect.server({
        root: dist,
        livereload: true
    });
    done();
}));