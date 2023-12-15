const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  // 开启代理服务器——用于跨域访问（不过这个事情一般都是后端完成的）
  devServer: {
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_PROXY_PATH,
        // 由于路径中本身就具有api，所以不需要把api去掉
        // pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true
      }
    }
  }
})
