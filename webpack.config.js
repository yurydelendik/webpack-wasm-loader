module.exports = {
  context: __dirname,
  entry: {
    'main': './example/entry.js',
  },
  output: {
    path: __dirname + '/out/',
    publicPath: './out/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        use: './loader/wasm-loader.js'
      }
    ]
  },
  resolve: {
      alias: {
        time: __dirname + '/example/time.js',
      }
  },
};