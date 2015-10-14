/**
 * Build
 * =====
 *
 *
 */

var path = require('path')

var merge = require('deep-merge')(function (target, source, key) {
  if (target instanceof Array) {
    return [].concat(target, source)
  }
  return source
})

var webpack = require('webpack')
var express = require('express')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var autoprefixer = require('autoprefixer')
var pxtorem = require('postcss-pxtorem')
var lost = require('lost')
var rucksack = require('rucksack-css')

var manifest = require('./package.json')

// environment (default mode: development)
var env = {
  ENTRY_FILE: path.resolve(__dirname, 'src/index.js'),
  SOURCE_DIRECTORY: path.resolve(__dirname, 'src'),
  EXAMPLE_ENTRY_FILE: path.resolve(__dirname, 'example/main.js'),
  EXAMPLE_DIRECTORY: path.resolve(__dirname, 'example'),
  DIST_DIRECTORY: path.resolve(__dirname, path.dirname(manifest.main)),
  FILE_NAME: path.basename(manifest.main, path.extname(manifest.main)),
  isProduction: (process.env.NODE_ENV === 'production') || process.argv.length > 2,
  EXPORT_NAME: 'Editor',
  PORT: 10000
}

var config = {
  target: 'web',
  devtool: 'eval',
  output: {
    path: env.DIST_DIRECTORY,
    library: env.EXPORT_NAME,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          env.SOURCE_DIRECTORY,
          path.resolve(__dirname, 'node_modules/react-tabs') // require during build process
        ],
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0,
          env: {

            development: !env.isProduction ? {
              plugins: ['react-transform'],
              extra: {
                'react-transform': {
                  transforms: [
                    {
                      transform: 'react-transform-hmr',
                      imports: ['react'],
                      locals: ['module']
                    },
                    {
                      transform: 'react-transform-catch-errors',
                      imports: ['react', 'redbox-react']
                    }
                    // {
                    //   target: 'react-transform-render-visualizer'
                    // }
                  ]
                }
              }
            } : null

          }
        }
      },
      {
        test: /\.styl$/,
        loader: 'style!css!postcss!stylus'
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        loader: 'url',
        query: {
          limit: 10240
        }
      }
    ]
  },
  stylus: {
    errors: true
  },
  postcss: function(){
    return [
      lost({/** https://github.com/corysimmons/lost#global-grid-settings **/
        flexbox: 'flex'
      }),
      rucksack({/** https://github.com/simplaio/rucksack#options **/}),
      pxtorem({/** https://github.com/cuth/postcss-pxtorem#options **/}),
      autoprefixer({/** https://github.com/postcss/autoprefixer-core#usage **/
        // browsers: ['last 2 versions']
      })
    ]
  }
}

// development: build + watch | virtual
if (!env.isProduction) {
  config = merge(config, {
    output: {
      filename: env.FILE_NAME + '.js',
      publicPath: '/dist/' // virtual
    },
    entry: [
      env.EXAMPLE_ENTRY_FILE,
      'webpack-hot-middleware/client'
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(), //{/** quiet: true **/}
      new webpack.NoErrorsPlugin()
    ]
  })

  var app = express()
  var compiler = webpack(config)

  // virtual embed !
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))

  app.use(webpackHotMiddleware(compiler))

  app.get('*', function (req, res) {
    var pathname = req.path
    if (pathname === '/') {
      pathname = '/index.html'
    }
    res.sendFile(env.EXAMPLE_DIRECTORY + pathname)
  })

  return app.listen(env.PORT, 'localhost', function (err) {
    if (err) {
      return console.error(err)
    }
    console.log(new Date().toISOString(), '- [sonarvio-editor] http://localhost:' + env.PORT)
  })
}

// production: release
webpack(merge(config, {
  devtool: 'source-map',
  entry: [
    env.ENTRY_FILE
  ],
  output: {
    filename: env.FILE_NAME + '.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: false,
      compress: {
        warnings: false
      }
    })
  ],
  stylus: {
    compress: true
  }
})).run(notify)


function notify (error, stats) {
  if (error) {
    return console.error(error)
  }
  console.log(new Date().toISOString(), ' - [' + env.EXPORT_NAME + ']', stats.toString())
}
