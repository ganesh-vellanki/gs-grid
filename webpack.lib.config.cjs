const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'css-loader' },
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern-compiler'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        esModule: false
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.scss']
    },
    output: {
        filename: 'index.mjs',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true
    }
};