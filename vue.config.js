const {defineConfig} = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api-gpa': {
                target: "https://www.study-npuer.com",
                changeOrigin: true,
                secure: false,
                ws: true,
                pathRewrite: {
                    "^/api-gpa": "/api-gpa",
                },
            },
        }
    },
    lintOnSave: process.env.NODE_ENV !== 'production',
    productionSourceMap: false,
    publicPath: "./",
    outputDir: 'gpa',
    configureWebpack: {
        plugins: [
            new CompressionPlugin({
                algorithm: 'gzip', // 使用gzip压缩
                test: /\.js$|\.css$|\.html$/, // 匹配文件名
                filename: '[path][base].gz', // 压缩后的文件名(保持原文件名，后缀加.gz)
                minRatio: 1, // 压缩率小于0.8才会压缩
                threshold: 1024, // 对超过10k的数据压缩
                deleteOriginalAssets: false// 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
            })
        ]
    }
})