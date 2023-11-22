// 当前的这个模块：对所有的API接口进行统一管理

/**
 * 如何去获取数据库中的数据
 * 1、如果项目很小——————可以在组件的生命周期函数中发送数据请求
 * 2、项目较大—————————就要使用接口的统一管理
 */

// 1、先将封装好的axios引入————方便后续的使用
import requestPack from "./axios.js";
import mockRequest from "@/api/mockAjax";

/**
 *  三级联动的API接口
 *  /api/product/getBaseCategoryList        get        无参数传递
 * 将这个函数暴露出去————之后哪个组件想要请求这个url的数据，只要引入这个函数就是可以使用了
 * @returns {*}
 */
export const reqCategoryList = function () {
    // axios发请求返回的结果是Promise对象
    return requestPack({
        url: '/product/getBaseCategoryList',
        method: 'get'
    })
}

/**
 * 获取首页轮播图的接口（banner）
 * @returns {*}
 */
export const reqGetBannerList = function () {
    // axios发请求返回的结果是Promise对象
    //axios请求方法型
    return mockRequest({
        url: '/banners',
        method: 'get'
    })
}

/**
 * 获取Floor的接口（Floor）
 * @returns {*}
 */
export const reqGetFloorList = function () {
    // axios发请求返回的结果是Promise对象
    //axios请求方法型
    return mockRequest({
        url: '/floors',
        method: 'get'
    })
}

/**
 * 获取搜索后的数据  接口：/api/list  post
 * 需要传递参数：
 * {
 *   "category3Id": "61",
 *   "categoryName": "手机",
 *   "keyword": "小米",
 *   "order": "1:desc",
 *   "pageNo": 1,
 *   "pageSize": 10,
 *   "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
 *   "trademark": "4:小米"
 * }
 */
export const reqGetSearchInfo = function (params) {
    return requestPack({
        url: '/list',
        method: "POST",
        data: params
    })
}

/**
 * 获取商品详情信息   /api/item/{ skuId }        GET
 */
export const getProductDetails = function (skuId) {
    return requestPack({
        url: `/item/${skuId}`,
        method: 'GET',
    })
}

/**
 * 将产品添加的购物车中（或者更新某一个产品的个数）————所以要将数据保存到后台服务器中
 * /api/cart/addToCart/{ skuId }/{ skuNum }      POST
 * @skuId  产品ID
 * @skuNum  产品数量
 */
export const reqAddOrUpdateShopCart = function (skuId, skuNum) {
    return requestPack({
        url: `/cart/addToCart/${skuId}/${skuNum}`,
        method: 'POST'
    })
}


/**
 * 购物车列表  /api/cart/cartList     GET
 * Shopping cart list
 */
export const reqCartList = function () {
    return requestPack({
        url: "/cart/cartList",
        method: 'get'
    })
}

/**
 * 删除购物车商品
 * /api/cart/deleteCart/{skuId}     DELETE
 */
export const deleteCart = function (skuId) {
    return requestPack({
        url: `/cart/deleteCart/${skuId}`,
        method: "delete"
    })
}

/**
 * 修改购物车中商品的勾选状态，用于结算
 * /api/cart/checkCart/{skuId}/{isChecked}  GET
 * isChecked  1 -- 勾选    0 -- 未勾选
 */
export const reqUpdateCheckedById = function (skuId, isChecked) {
    return requestPack({
        url: `/cart/checkCart/${skuId}/${isChecked}`,
        method: 'get'
    })
}
/**
 * 获取注册验证码
 * /api/user/passport/sendCode/{phone}
 */
export const reqGetCode = function (phone) {
    return requestPack({
        url: `/user/passport/sendCode/${phone}`,
        method: 'get'
    })
}

/**
 * 注册用户
 * /api/user/passport/register    POST
 */
export const userRegister = function (data) {
    return requestPack({
        url: '/user/passport/register',
        method: 'post',
        data,
    })
}

/**
 * 用户登录
 * /api/user/passport/login
 * POST
 */
export const userLogin = function (user) {
    return requestPack({
        url: '/user/passport/login',
        method: 'post',
        data: user,
    })
}

/**
 * 获取用户信息（token）
 * /api/user/passport/auth/getUserInfo
 * get
 */
export const reqGetUserInfo = function () {
    return requestPack({
        url: '/user/passport/auth/getUserInfo',
        method: 'get',
    })
}
/**
 * 用户退出
 * /api/user/passport/logout
 * GET
 */
export const reqUserLogOut = function () {
    return requestPack({
        url: '/user/passport/logout',
        method: 'get',
    })
}

/**
 * 支付页面---获取用户地址信息
 * /api/user/userAddress/auth/findUserAddressList
 * get
 */
export const reqFindUserAddressList = function () {
    return requestPack({
        url: '/user/userAddress/auth/findUserAddressList',
        method: 'get',
    })
}

/**
 * 获取订单交易页信息
 * /api/order/auth/trade
 * get
 */
export const reqTradeInfo = function () {
    return requestPack({
        url: '/order/auth/trade',
        method: 'get',
    })
}

/**
 * 提交支付订单
 * /api/order/auth/submitOrder?tradeNo={tradeNo}
 * post
 */
export const reqSubmitOrder = function (tradeNo, data) {
    return requestPack({
        url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
        method: 'post',
        data,
    })
}

/**
 * 获取订单支付信息
 * /api/payment/weixin/createNative/{orderId}
 * get
 */
export const reqOrderInfo = function (orderId) {
    return requestPack({
        url: `/payment/weixin/createNative/${orderId}`,
        method: 'get',
    })
}

/**
 * 获取支付订单状态
 * /api/payment/weixin/queryPayStatus/{orderId}
 * get
 */
export const reqPayStatus = function (orderId) {
    return requestPack({
        url: `/payment/weixin/queryPayStatus/${orderId}`,
        method: 'get',
    })
}

/**
 * 获取个人中心，我的订单列表
 * /api/order/auth/{page}/{limit}    GET
 */
export const myOrder = function (page, limit) {
    return requestPack({
        url: `/order/auth/${page}/${limit}`,
        method: "get"
    })
}
/*
//全部导出的操作
export default {
    reqCategoryList,
    xxx,
}*/
