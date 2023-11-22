import {getProductDetails, reqAddOrUpdateShopCart} from "@/api";
import {getUUID} from "@/utils/uuid_token";

const actions = {
    async productDetails({commit}, skuId) {
        let result = await getProductDetails(skuId);
        if (result.code === 200) {
            commit("PRODUCTDETAILS", result.data)
        }
    },
    // 购物车存放数据post
    async addOrUpdateShopCart({commit}, {skuId, skuNum}) {
        let result = await reqAddOrUpdateShopCart(skuId, skuNum);
        if (result.code) {
            return "ok"
        } else {
            return Promise.reject(new Error("faile"))
        }
    }

}

const mutations = {
    PRODUCTDETAILS(state, detailList) {
        state.detailList = detailList;
    },
}

const state = {
    detailList: {},
    uuid_token: getUUID(),
}

const getters = {
    categoryView(state) {
        // 当服务器中的数据没有回来的时候，返回值是一个undefined，这时候再去xxx.zzz就会报错，如果直接返回一个空对象就不会报错了
        return state.detailList.categoryView || {};
    },
    skuInfo(state) {
        return state.detailList.skuInfo || {};
    },
    spuSaleAttrList(state) {
        return state.detailList.spuSaleAttrList || [];
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}