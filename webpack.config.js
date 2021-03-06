module.exports.getConfig = function(type, port) {

  port = (typeof port === 'undefined' || !port) ? 9001 : port;

  var webpack = require('webpack');
  var path = require('path');

  var config = {
    entry: {
      app: [
        "./app/scripts/App.jsx"
      ]
    },
    output: {
      path: path.join(__dirname + '/dist'),
      publicPath: '/dist/js/',
      filename: 'main.js',
    },
    resolve: {
      modulesDirectories: [
        // path.join(__dirname + '/app/scripts/'),
        // path.join(__dirname + '/app/bower_components'),
        'node_modules'
      ],
      extensions: ['', '.js', '.jsx']

      // root: __dirname + '/app/scripts',
      // alias: {
      //   jquery: 'jquery/dist/jquery.min.js'
      // },
      // fallback: path.join(__dirname, 'node_modules')
    },
    plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      }),
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", [])
      )
    ],
    debug : type === 'dev',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: [
            path.join(__dirname, '/app/scripts'),
            // path.join(__dirname, 'node_modules/clipboard/src'),
            // path.join(__dirname, '/node_modules/react-infinite/src'),
            // path.join(__dirname, '/node_modules/react-dailymotion-follow/src')
          ],
          // exclude: [
          //   __dirname + '/node_modules',
          // ],
          // exclude: /node_modules/,
          loaders: ['babel-loader']
        }
      ]
    }
  };

  if (type === 'dev') {

    config.devtool = 'eval';

    config.entry.app = [
      'webpack-dev-server/client?http://localhost:'+port, // WebpackDevServer host and port
      'webpack/hot/only-dev-server',
      // "webpack/hot/dev-server",
      "./app/scripts/App.jsx"
    ];

    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        __IMAGES__: JSON.stringify('dist/images/')
      })
    );

    config.module.loaders[0].loaders = ['react-hot','babel-loader'];

  } 

  return config;
}
