const path = require('path');

module.exports = {
    entry: ['./example/src/index.ts'],
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        liveReload: true,
        static: {
            directory: path.resolve(__dirname, 'demo'),
            publicPath: '/demo/'
        },
        watchFiles: ['src/**/*', 'example/**/*']
    },
    module: {
        rules: [{
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.scss$/, use: [ 
                { loader: "css-loader" },
                {
                    loader: "sass-loader",
                    options: {
                        api: "modern-compiler"
                    }
                },
            ] },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        esModule: false
                    }
                }
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'example')
    }
};