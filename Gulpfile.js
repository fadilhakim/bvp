require('dotenv').config();

var gulp = require('gulp'),
    rev = require('gulp-rev'),
    watch = require('gulp-watch'),
    merge = require('merge-stream');

var gutil = require('gulp-util');

// Gulp S3 Access - Write Only
var config = {
    accessKeyId: "AKIAI25QLTB65RFAXTPQ",
    secretAccessKey: "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"
}
var s3 = require('gulp-s3-upload')(config);

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('js', function() {
    var jsFiles = [
        './bower_components/angular/angular.min.js',
        './bower_components/angular-cookies/angular-cookies.min.js',
        './public/js/jquery-3.3.1.min.js',
        './public/js/homeApp.js',
        './public/js/popper.js',
        './public/js/counter.js',
        './public/js/pricing.js',
        './public/js/registration-storage.js',
        './public/js/login.js',
        './public/js/langSelector.js',
        './public/js/axios.min.js',
        './public/js/smooth-scroll.js',
        './public/js/smooth-scroll.js',
        './public/lang/localization.js',
        './public/js/slick.min.js',
        './public/js/script.js',
        './public/bootstrap/js/bootstrap.min.js',
    ];

    jsFiles.push('./config/' + process.env.NODE_ENV + '.js');

    if (process.env.NODE_ENV === 'local') {
        gulp.src(jsFiles)
            .pipe(plugins.filter('**/*.js'))
            .pipe(plugins.concat('application.js'))
            .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
            .pipe(gulp.dest('./public/dist/js'))
            .pipe(plugins.notify('Build JS Success'));
    } else {
        gulp.src(jsFiles)
            .pipe(plugins.filter('**/*.js'))
            .pipe(plugins.concat('application.js'))
            .pipe(plugins.uglify())
            .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
            .pipe(gulp.dest('./public/dist/js'))
            .pipe(rev())
            .pipe(gulp.dest('./public/dist/js'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./public/dist/js'));
    }

});

gulp.task('css', function() {
    var cssFiles = [
        './bower_components/angular/angular-csp.css',
        './public/bootstrap/css/bootstrap.css',
        './public/stylesheets/header.css',
        './public/stylesheets/footer.css',
        './public/stylesheets/screen.css',
        './public/stylesheets/benefits.css',
        './public/stylesheets/pricing.css',
        './public/stylesheets/complement.css',
        './public/stylesheets/slick.css',
        './public/stylesheets/margin+padding.css',
        './public/stylesheets/slick-theme.css'
    ];

    if (process.env.NODE_ENV === 'local') {
        var cssStream = gulp.src(cssFiles)
            .pipe(plugins.filter('**/*.css'))
            .pipe(plugins.concat('application.css'))
            .pipe(gulp.dest('./public/dist/stream/css'));

        var mergedStream = merge(cssStream)
            .pipe(plugins.concat('application.css'))
            .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
            .pipe(gulp.dest('./public/dist/css'))
            .pipe(plugins.notify('Build CSS Success'));

        return mergedStream;

    } else {
        var cssStream = gulp.src(cssFiles)
            .pipe(plugins.filter('**/*.css'))
            .pipe(plugins.concat('application.css'))
            .pipe(gulp.dest('./public/dist/stream/css'));

        var mergedStream = merge(cssStream)
            .pipe(plugins.concat('application.css'))
            .pipe(plugins.uglifycss())
            .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
            .pipe(gulp.dest('./public/dist/css'))
            .pipe(rev())
            .pipe(gulp.dest('./public/dist/css'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./public/dist/css'));

        return mergedStream;
    }

});

gulp.task("upload", function() {
    gulp.src("./public/dist/**/*")
        .pipe(s3({
            Bucket: 'bridestory-assets-sg', //  Required
            ACL: 'public-read',
            keyTransform: function(fileName) {
                var newName = changeFileName(fileName);
                return newName;
            }
        }, {
            // S3 Constructor Options, ie:
            maxRetries: 5
        }));
});

gulp.task('default', ['js', 'css']);

gulp.task('watch', function() {
    gulp.watch(['./public/js/*.js', './public/stylesheets/*.css'], ['js', 'css']);
});

function changeFileName(fileName) {
    return 'raw/upload/business-home/' + fileName;
}