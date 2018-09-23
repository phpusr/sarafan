const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.join(__dirname, 'src', 'main', 'resources', 'static', 'js', 'main.js'),
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 8000,
        allowedHosts: [
            'localhost:8080'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    require.resolve("bootstrap-vue")
                ],
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'src', 'main', 'resources', 'static', 'js'),
            path.join(__dirname, 'node_modules'),
        ],
    }
};