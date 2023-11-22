import VueRouter from 'vue-router'
import routes from "@/router/routes";

// 重写一下push和repalce
let Originpush = VueRouter.prototype.push
VueRouter.prototype.push = function (location, resolve, reject) {
    // console.log(location);

    if (resolve || reject) {
        // 可以篡改函数的上下文
        Originpush.call(this, location, resolve, reject);

    }
    Originpush.call(this, location, () => {
    }, () => {
    });

}
let Originrepalce = VueRouter.prototype.repalce
VueRouter.prototype.repalce = function (location, resolve, reject) {
    if (resolve || reject) {
        Originrepalce.call(this, location, resolve, reject);
    }
    Originrepalce.call(this, location, () => {
    }, () => {
    });
}

/**
 * 创建路由器
 * @type {VueRouter}
 */
const router = new VueRouter({
    // 添加一个滚轮滚动行为
    // history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        return {
            y: 0
        }
    }
})

/**
 * 前置路由守卫----当用户没有登录的时候无法去到购物车查看商品商品信息
 * todo 这里需要重新写一个全局路由守卫了
 */



// 将路由器暴露出去————这种暴露方法便于去写路由守卫
export default router;