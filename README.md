# my_firstvueproject

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

<!-- 文件夹的用途 -->

node_modules:放置项目依赖的地方
public:一般放置一些共用的静态资源，打包上线的时候，public 文件夹里面资源原封不动打包到 dist 文件夹里面
src：程序员源代码文件夹
-----assets 文件夹：经常放置一些静态资源（图片）(多个组件共用的静态资源)，assets 文件夹里面资源 webpack 会进行打包为一个模块（js 文件夹里面）
-----components 文件夹:一般放置非路由组件（或者项目共用的组件）
App.vue ——————>唯一的根组件
main.js ——————>入口文件【程序最先执行的文件】
babel.config.js:——————>babel 配置文件（babel 可以将 ES6 的语法翻译为 ES5 的语法，使得兼容性更好一些）
package.json——————> 看到项目描述、项目依赖、项目运行指令
package-lock.json————>缓存性的文件
pages——————>保存路由组件
router——————>路由器设置
store——————>用来保存共享的文件设置
API-------->用来保存 axios 文件的（数据请求）
README.md——————> 项目说明文件
utils————————> 常用来保存项目所需的功能文件（例如，常用的正则表达式）
