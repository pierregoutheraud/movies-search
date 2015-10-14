var gulp = require('gulp'),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    es = require('event-stream'),
    WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    del = require("del"),
    webpackStream = require('webpack-stream'),
    runSequence = require('run-sequence'),
    babelify = require('babelify')
    fs = require('fs'),
    gutil = require('gulp-util');

// set variable via $ gulp --type prod
var environment = $.util.env.t || $.util.env.type || 'dev';

console.log('Environment: ' + environment);
// console.log('Style: ' + style);

var isProduction = environment === 'prod';

var port = $.util.env.port || 9001;
var app = 'app/';
var dist = 'dist/';

var webpackConfig = require('./webpack.config.js').getConfig(environment, port);

// https://github.com/ai/autoprefixer
var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

// copy images
gulp.task('images', function(cb) {
  return gulp.src(app + 'images/**/*.{png,svg,jpg,jpeg,gif,mp3}')
    .pipe($.size({ title : 'images' }))
    .pipe(gulp.dest(dist + 'images/'))
});

// gulp.task("webpack", function(callback) {
    // run webpack
    // webpack(webpackConfig, function(err, stats) {
        // if(err) throw new gutil.PluginError("webpack", err);
        // gutil.log("[webpack]", stats.toString({
            // output options
        // }));
//         callback();
//     });
// });

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
      publicPath: webpackConfig.output.publicPath,
      historyApiFallback: true,
      hot: true
    }).listen(port, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        $.util.log("[webpack-dev-server]", "http://localhost:"+port+"/webpack-dev-server/index.html");
        // keep the server alive or continue?
        // callback();
    });

});

gulp.task('serve-example', function() {
  $.connect.server({
    host: '0.0.0.0',
    root: example,
    port: port,
    livereload: {
      port: 35728
    }
  });
});

gulp.task('scripts', function(cb) {
  return gulp.src("./app/scripts/App.jsx")
    .pipe(webpackStream(webpackConfig))
    .pipe($.uglify())
    .pipe($.size({ title : 'js' }))
    .pipe(gulp.dest(dist + 'js/'));
});

gulp.task('serve-dist', function() {
  $.connect.server({
    host: '0.0.0.0',
    root: dist,
    port: port,
    livereload: {
      port: 35728
    }
  });
});

var vendorsSources = [
  'node_modules/hint.css/hint.min.css',
  'node_modules/trackpad-scroll-emulator/css/trackpad-scroll-emulator.css',
  'node_modules/react-dailymotion-follow/dist/react-dailymotion-follow.css',
  'node_modules/emojione/assets/css/emojione.min.css'
];

gulp.task('styles', function(cb) {

  var vendorsStream = gulp.src(vendorsSources)
                          .pipe(isProduction ? $.minifyCss({processImport: false}) : $.util.noop());

  var mainStream = gulp.src([
                          app + 'styles/main.scss'
                        ])
                        .pipe((isProduction ? $.util.noop() : $.sourcemaps.init()))
                        .pipe($.sass({
                          outputStyle: isProduction ? 'compressed' : 'expanded'
                        }).on('error', $.sass.logError))
                        .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
                        .pipe(isProduction ? $.util.noop() : $.sourcemaps.write());

  return es.merge([vendorsStream, mainStream])
                      .pipe($.concat('main.css'))
                      .pipe($.size({ title : 'css' }))
                      .pipe(gulp.dest(dist + 'css/'))
                      .pipe($.livereload());

});

// copy html from app to dist
gulp.task('html', function(cb) {
  return gulp.src(app + 'index.html')
    .pipe($.size({ title : 'html' }))
    .pipe(gulp.dest(dist));
});

gulp.task('copy', function(cb) {
  // no more stuff here
});

// watch styles, html and js file changes
gulp.task('watch', function() {
  $.livereload.listen(35728);
  gulp.watch(app + 'styles/**/*.scss', ['styles']);
  // gulp.watch(app + 'index.html', ['html']);
  // gulp.watch(app + 'scripts/**/*.js', ['scripts']);
  // gulp.watch(app + 'scripts/**/*';, ['scripts']);
});

// clean dist
gulp.task('clean', function(cb) {
  del([dist + '*'], cb);
});

gulp.task('dev', ['webpack-dev-server', 'styles', 'watch', 'images'])

// waits until clean is finished then builds the project
gulp.task('build', function(callback){
  runSequence(
    'clean',
    ['images', 'scripts', 'styles', 'html'],
    'serve-dist',
    callback
  );
});
