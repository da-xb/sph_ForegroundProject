import Vue from 'vue'
import App from './App.vue'

// 三级联动组件————全局组件（再main.js中进行组件的声明）
import TypeNav from './components/TypeNav'
import Carousal from "@/components/Carousal";
import Paginations from "@/components/Paginations/Paginations";
import {MessageBox} from "element-ui";
// 第一个参数是全局组件的名字，第二个参数指的是哪一个组件（由于组件的名词可能会改变，所以直接写成TypeNav.name）
Vue.component(TypeNav.name, TypeNav)    //
Vue.component(Carousal.name, Carousal)  // 轮播图
Vue.component(Paginations.name, Paginations)  // 分页器
// elmentUI 组件样式引入————挂在原型上进行组件注册
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;


// 引入路由
import VueRouter from 'vue-router'
// 由于路由是一个插件，所以需要使用use进行启用
Vue.use(VueRouter)
// 引入路由器
import router from './router'
// 引入vuex仓库
import store from './store'
// 引入mock模拟数据的配置
import "./mock/mockServe"

// 引入swiper样式
import 'swiper/css/swiper.min.css'


Vue.config.productionTip = false

new Vue({
    // 注册vuex仓库
    store,
    // 注册路由器
    router,//在这里注册后，就会拥有两个属性（$route和$router），因为在路由器中以及引用了路由
    render: h => h(App),
}).$mount('#app')
