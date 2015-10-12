module.exports = function(config) {

  var webpackConfig = require('./webpack.config.js').getConfig('test');
  webpackConfig.devtool = 'inline-source-map';

  config.set({
    // browsers: ['Chrome'],
    autoWatch: true,
    browsers: ['PhantomJS'],
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      { pattern: 'tests.webpack.js', watched: true },
    ],
    frameworks: ['jasmine'],
    preprocessors: {
      'tests.webpack.js': ['webpack'],
    },
    reporters: ['dots'],
    singleRun: true,
    webpack: {
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      resolve: webpackConfig.resolve,
      plugins: webpackConfig.plugins,
      module: webpackConfig.module
    },
    webpackServer: {
      noInfo: false,
    },
  });

};
