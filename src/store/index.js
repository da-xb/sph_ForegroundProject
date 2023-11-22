// store就是一个大仓库，用来保存所有组件都要用的数据
import Vue from 'vue'
import Vuex from 'vuex'

// 引入小仓库
import home from './home'
import search from './search'
import detail from "./detail"
import cartList from "@/store/cartList";
import user from "@/store/user";
import trade from "@/store/trade";

// 这里需要启用Vuex（因为Vuex是一个组件）
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        home,
        search,
        detail,
        cartList,
        user,
        trade,
    }
})