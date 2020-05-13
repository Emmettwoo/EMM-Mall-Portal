let webpack = require('webpack');

// 导入各种插件（详细用途见plugins项）
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack-dev-server的运行方式
let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 自定义函数: 生成html-webpack-plugin需要的参数
let getHtmlConfig = function(name, title) {
    return {
        // 要处理的html
        template: './src/view/' + name + '.html',
        // 处理后的输出位置
        filename: 'view/' + name + '.html',
        // 网页favicon图标
        favicon: 'favicon.ico',
        // 供HTML读取用的标题
        title: title,
        // 是否注入js
        inject: true,
        // 注入采用哈希后缀
        hash: true,
        // 需要注入的js列表
        chunks: ['common', name]
    }
};

// Webpack主配置
let config = {
    // 打包模式为开发（默认为 production, 可选 development)
	mode: 'production',
    
    entry: {
        'common': './src/page/common/index.js',
        'index': './src/page/index/index.js',
        'about': './src/page/about/index.js',
        'result': './src/page/result/index.js',
        'list': './src/page/list/index.js',
        'detail': './src/page/detail/index.js',
        'cart': './src/page/cart/index.js',
        'payment': './src/page/payment/index.js',
        'order-confirm': './src/page/order/confirm/index.js',
        'order-list': './src/page/order/list/index.js',
        'order-detail': './src/page/order/detail/index.js',
        'user-login': './src/page/user/login/index.js',
        'user-register': './src/page/user/register/index.js',
        'user-pwd-reset': './src/page/user/pwd-reset/index.js',
        'user-pwd-update': './src/page/user/pwd-update/index.js',
        'user-center': './src/page/user/center/index.js',
        'user-update': './src/page/user/update/index.js'
    },
    output: {
        path: __dirname + '/dist/',
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.woohoo.top/',
        filename: 'js/[name].js'
    },
    // 项目外JS的引用声明
	externals: {
		jquery: 'window.jQuery'
    },
    resolve: {
        // 路径别名配置
        alias: {
            node_modules: __dirname + '/node_modules',
            util: __dirname + '/src/util',
            page: __dirname + '/src/page',
            service: __dirname + '/src/service',
            image: __dirname + '/src/image'
        }
    },
    module: {
        loaders: [
            // 样式文件加载处理逻辑
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader")
            },// String文件加载处理逻辑
            {
                test: /\.string$/,
                loader: 'html-loader'
            },
            // 图片文件加载处理逻辑
            {
                test: /\.(gif|png|jpg|jpeg)\??.*$/,
                loader: 'url-loader?limit=100&name=resource/image/[name].[ext]'
            },
            // 字体文件加载处理逻辑
            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=100&name=/resource/font/[name].[ext]'
            }
        ]
    },
    plugins: [
        // 通用js模块合并打包
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        // css文件独立打包
        new ExtractTextPlugin("css/[name].css"),
        // html模板处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '门户首页')),
        new HtmlWebpackPlugin(getHtmlConfig('about', '关于平台')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
        new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('payment', '在线支付')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list', '订单列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登入')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pwd-reset', '密码重置')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pwd-update', '密码修改')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center', '用户中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-update', '修改信息'))
    ]
};

module.exports = config;