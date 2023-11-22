import {reqFindUserAddressList, reqSubmitOrder, reqTradeInfo} from "@/api";

const actions = {
    // 获取用户地址
    async findUserAddressList({commit}) {
        let result = await reqFindUserAddressList();
        if (result.code === 200) {
            commit('FINDUSERADDRESSLIST', result.data)
        }
    },
    // 获取商品清单数据
    async getTradeInfo({commit}) {
        let result = await reqTradeInfo();
        if (result.code === 200) {
            commit('GETTRADEINFO', result.data);
        }
    },
    /*// 提交订单信息
    async submitOrder({commit}, tradeNo) {
        let result = await reqSubmitOrder(tradeNo);
        console.log('result', result)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    }*/
}
const mutations = {
    FINDUSERADDRESSLIST(state, addressList) {
        state.addressList = addressList;
    },
    GETTRADEINFO(state, tradeInfo) {
        state.tradeInfo = tradeInfo;
    }
}
const state = {
    addressList: [],
    tradeInfo: {}
}
const getters = {
    // detailArrayList(state) {
    //     return state.tradeInfo.detailArrayList || [];
    // }
}
export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}