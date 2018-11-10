const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader')
const { resolve } = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")


module.exports = {
  devtool: "source-map",
  entry: {
    "content-script": "./src/content/script.js",
    "background": "./src/background/script.js"
  },
  output: {
    publicPath: ".",
    path: resolve(__dirname, "dist/"),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [
          resolve(__dirname, "/node_modules/")
        ],
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  
  plugins: [
    new ChromeExtensionReloader(),
    new CopyWebpackPlugin([{ from: "./src/manifest.json", flatten: true }])
  ]
}

// module.exports = {
//   entry: {
//     'content-script': './src/content/script.js',
//     background: './src/background/script.js'
//   },
//   //...
//   plugins: [
//       new ChromeExtensionReloader({
//         port: 9090, // Which port use to create the server
//         reloadPage: true, // Force the reload of the page also
//         entries: { //The entries used for the content/background scripts
//           contentScript: 'content-script', //Use the entry names, not the file name or the path
//           background: 'background'
//         }
//       })
//   ]
// }