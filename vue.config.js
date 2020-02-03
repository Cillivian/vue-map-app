module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/resume-vue" : "/",
    outputDir: 'dist',
    lintOnSave: false,
    runtimeCompiler: true, //关键点在这
    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
    chainWebpack: () => {},
    configureWebpack: () => {},
    // 配置 webpack-dev-server 行为。
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // proxy: {
        //     '^/api': {
        //         target: '127.0.0.1:3000',
        //         ws: true,
        //         changeOrigin: true
        //     },
        //     // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
        //     //      proxy: 'http://kungfuzhineng.com', // string | Object
        //     // eslint-disable-next-line no-unused-vars
        //     before: app => {}
        // }
    }
};