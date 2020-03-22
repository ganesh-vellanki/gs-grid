const path = require('path');

module.exports = {
    entry: './demo/index.js',
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: './demo',
        liveReload: true,
        watchContentBase: true,
        hot: false,
        watchOptions: {
            poll: true
        }
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
              }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};