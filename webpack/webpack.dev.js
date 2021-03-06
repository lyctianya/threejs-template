const path = require('path')
const { merge } = require('webpack-merge')
const Common = require('./webpack.common.js')
const paths = require('./getPath')

// 合并公共配置,并添加开发环境配置
module.exports = merge(Common, {
    mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
    devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲
    devServer: {
        port: 3000,
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: true, // 开启热更新，后面会讲react模块热替换具体配置
        historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        open: true,
        static: {
            directory: paths.PUBLIC //托管静态资源public文件夹
        }
    }
})
