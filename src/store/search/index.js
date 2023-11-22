// search模块的小仓库
import {reqGetSearchInfo} from "@/api";

const actions = {
	async GetSearchInfo({commit}, params = {}) {
		let result = await reqGetSearchInfo(params);
		// console.log(result);
		if (result.code === 200) {
			commit("GETSEARCHINFO", result.data)
		}
	}
}

const mutations = {
	GETSEARCHINFO(state, searchInfo1) {
		state.searchList = searchInfo1;
	}
}

const state = {
	searchList: {}
}

const getters = {
	// 当网卡的时候，从后端服务器返回数据不及时，就会返回一个undefine这就会造成前端错误，所以需要设置一个空数组
	trademarkList(state) {
		return state.searchList.trademarkList || [];
	},
	attrsList(state) {
		return state.searchList.attrsList || [];
	},
	goodsList(state) {
		return state.searchList.goodsList || [];
	},
}

export default {
	namespaced: true,
	actions,
	mutations,
	state,
	getters
}