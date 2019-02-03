const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development';
const isDev = ['development', 'test', 'staging'].includes(env);
const isProd = !isDev;
const dist = path.join(__dirname, 'dist');
const filterUndefined = p => p === undefined;

module.exports = {
    mode: isDev ? 'development' : 'production' ,
    target: 'node',
    externals: [nodeExternals()],
    devtool: "source-map",
    entry: "./src/index.ts",
    stats: "verbose",
    plugins: [
        isProd && new CleanWebpackPlugin({}),
        isDev && new webpack.HotModuleReplacementPlugin({}),
    ].filter(filterUndefined),
    output: {
        path: dist,
        filename: "server.js"
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        alias: {
            src: path.resolve(__dirname, 'src/')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
        ]
    }
};
