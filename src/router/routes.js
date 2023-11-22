import Home from "@/pages/Home/Home";
import Search from "@/pages/Search/Search";
import Detail from "@/pages/Detail";
import AddCartSuccess from "@/pages/AddCartSuccess";
import ShopCart from "@/pages/ShopCart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Trade from "@/pages/Trade"
import Pay from "@/pages/Pay";
import PaySuccess from "@/pages/PaySuccess";
import Center from "@/pages/Center";
import myOrder from "@/pages/Center/myOrder/myOrder";
import groupOrder from "@/pages/Center/groupOrder/groupOrder";

export default [// 路由重定向
    {
        path: '/',
        redirect: '/home'//这里写的是path路径
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            showHeader: true,
            showFooter: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            showHeader: false,
            showFooter: false
        },
        // 独享路由守卫————写在路由里面
        beforeEnter(to, from, next) {
            let token = localStorage.getItem("TOKEN")
            if (token) {
                alert("用户已登录，请先退出登录")
            } else {
                next();
            }
        }
    },
    {
        // 使用params传参需要先进行占位
        path: "/search/:keyword?",
        name: 'search',
        // 路由懒加载的写法————避免首次加载的时候需要加载所有的组件（就是再用到这个组件的时候再去引用对应的路由组件）
        // component:()=>{
        //     import('../pages/Search/Search.vue')
        // },
        component: Search,
        meta: {
            showHeader: true,
            showFooter: true
        },
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            showHeader: false,
            showFooter: false
        }
    },
    {
        path: '/detail/:skuid',
        name: 'detail',
        component: Detail,
        meta: {
            showHeader: true,
            showFooter: true
        }
    },
    {
        // 商品添加到购物车成功后的跳转路由
        path: "/addcartsuccess",
        name: 'addcartsuccess',
        component: AddCartSuccess,
        meta: {
            showHeader: true,
            showFooter: true
        }
    },
    {
        //  购物车
        path: "/shopcart",
        name: 'shopcart',
        component: ShopCart,
        meta: {
            showHeader: true,
            showFooter: true,
        },
        beforeEnter(to, from, next) {
            let token = localStorage.getItem("TOKEN")
            if (token) {
                next();
            } else {
                // todo 如果token过期则要返回到登录页面(可是判断token是否否过期是要放在请求响应拦截器里面设置的啊？？？？？？)
                console.log('token失效或者没有登录')
                // 用户没登录就要路由跳转到登录页面（但是在进行这一步的时候会出现bug）
                next('login');
            }
        }
    },
    {
        // 支付页面商品展示页面
        path: "/trade",
        name: 'trade',
        component: Trade,
        meta: {
            showHeader: false,
            showFooter: true,
        },
        beforeEnter(to, from, next) {
            let token = localStorage.getItem("TOKEN")
            if (token) {
                next();
            } else {
                // todo 如果token过期则要返回到登录页面(可是判断token是否否过期是要放在请求响应拦截器里面设置的啊？？？？？？)
                console.log('token失效或者没有登录')
                // 用户没登录就要路由跳转到登录页面（但是在进行这一步的时候会出现bug）
                next('login');
            }
        }
    },
    {
        // 支付页面
        path: "/pay",
        name: 'pay',
        component: Pay,
        meta: {
            showHeader: false,
            showFooter: true,
        },
        // 独享路由守卫————写在路由里面
        beforeEnter(to, from, next) {
            let token = localStorage.getItem("TOKEN")
            if (token) {
                next();
            } else {
                // todo 如果token过期则要返回到登录页面(可是判断token是否否过期是要放在请求响应拦截器里面设置的啊？？？？？？)
                console.log('token失效或者没有登录')
                // 用户没登录就要路由跳转到登录页面（但是在进行这一步的时候会出现bug）
                next('login');
            }
        }
    },
    {
        // 支付成功页面
        path: "/paysuccess",
        name: 'paysuccess',
        component: PaySuccess,
        meta: {
            showHeader: false,
            showFooter: true,
        },
        beforeEnter(to, from, next) {
            let token = localStorage.getItem("TOKEN")
            if (token) {
                next();
            } else {
                // todo 如果token过期则要返回到登录页面(可是判断token是否否过期是要放在请求响应拦截器里面设置的啊？？？？？？)
                console.log('token失效或者没有登录')
                // 用户没登录就要路由跳转到登录页面（但是在进行这一步的时候会出现bug）
                next('login');
            }
        }
    },
    {
        // 个人中心页面
        path: "/center",
        name: 'center',
        component: Center,
        // 二级路由组件
        childrens: [
            {
                path: 'myorder',
                name: 'myorder',
                component: myOrder,
            }, {
                path: 'grouporder',
                name: 'grouporder',
                component: groupOrder,
            }, {
                // 重定向
                path:'/center',
                redirect:'/center/myorder'
            }
        ],
        meta: {
            showHeader: false,
            showFooter: false,
        },
        /*beforeEnter(to, from, next) {
            let token = localStorage.getItem("TOKEN")
            if (token) {
                next();
            } else {
                // todo 如果token过期则要返回到登录页面(可是判断token是否否过期是要放在请求响应拦截器里面设置的啊？？？？？？)
                console.log('token失效或者没有登录')
                // 用户没登录就要路由跳转到登录页面（但是在进行这一步的时候会出现bug）
                next('login');
            }
        }*/
    }

]