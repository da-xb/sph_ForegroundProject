const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  // 开启代理服务器——用于跨域访问（不过这个事情一般都是后端完成的）
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        // 由于路径中本身就具有api，所以不需要把api去掉
        // pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true
      }
    }
  }
})
