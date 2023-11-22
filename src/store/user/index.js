/**
 * 后台管理
 * 登录  、  注册模块仓库
 * @type {{}}
 */
import {reqGetCode, reqGetUserInfo, reqUserLogOut, userLogin, userRegister} from "@/api";


const actions = {
    // 获取验证码
    async getCode({commit}, phone) {
        let result = await reqGetCode(phone);
        // 这里的判断不用写，因为真实情况是验证码直接发送到用户手机，用户自己填写，我们根本不用去看返回值是什么，不用去保存验证码
        if (result.code == 200) {
            commit("GETCODE", result.data)
            return 'ok'
        } else {
            return new Promise.reject(new Error('faile'))
        }
    },
    // 用户注册---需要返回成功或者失败
    async userRegister({commit}, data) {
        let result = await userRegister(data);
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    },

    // 用户登录--[带Token(后端返回这个Token,之后所有的操作都需要携带token)]
    async userLogin({commit}, user) {
        let result = await userLogin(user);
        if (result.code == 200) {
            // 将token放入到localStarage中
            localStorage.setItem("TOKEN", result.data.token)
            return "ok"
        } else {
            return Promise.reject(new Error(result.message))
        }
    },

    // 获取用户信息
    async getUserInfo({commit}) {
        let result = await reqGetUserInfo();
        // console.log(result)
        if (result.code == 200) {
            commit("GETUSERINFO", result.data)
        }
    },
    // 用户退出登录请求——————需要知道是否成功
    async userLogOut() {
        let result = await reqUserLogOut();
        // console.log(result)
        if (result.code == 200) {
            return result.message
        } else {
            return Promise.reject(result.message)
        }
    }


}
const mutations = {
    GETCODE(state, data) {
        state.code = data;
    },
    GETUSERINFO(state, data) {
        state.userInfo = data;
    }
}
const state = {
    code: '',
    userInfo: {}
}
const getters = {}
export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}