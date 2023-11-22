import {deleteCart, reqCartList, reqUpdateCheckedById} from "@/api";

const actions = {
    // 获取购物车商品信息
    async getCartList({commit}) {
        let result = await reqCartList();
        if (result.code == 200) {
            commit("GETCARTLIST", result.data)
        }
    },
    // 删除购物车商品
    async deleteCart({commit}, skuId) {
        let result = await deleteCart(skuId);
        if (result.code == 200) {
            return "ok"
        } else {
            return Promise.reject(new Error("faile"))
        }
    },
    // 修改购物车某个产品的选中状态
    async updateCheckedById({commit}, {skuId, isChecked}) {
        let result = await reqUpdateCheckedById(skuId, isChecked);
        if (result.code == 200) {
            return "ok"
        } else {
            return Promise.reject(new Error("faile"))
        }
    },

    // 购物车全选按钮操作
    // todo promise.all 的操作没见过
    chooseAll({dispatch, state}, checked) {
        let promiseAll = [];
        // 购物车商品信息-----state.cartList[0].cartInfoList
        state.cartList[0].cartInfoList.forEach(item => {
            // 将所有的商品的isChecked都修改
            let promise = dispatch("updateCheckedById", {skuId: item.skuId, isChecked: checked})
            promiseAll.push(promise);
        })
        // 返回最终的结果
        return Promise.all(promiseAll)
    }
}
const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList;
    }
}
const state = {
    cartList: []
}
const getters = {
    cartList() {
        return state.cartList[0] || {};
    },
}
export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}