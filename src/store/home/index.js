// 引入一下API请求接口————载actions中去请求服务器中的数据（axios封装后的API接口）
import {reqCategoryList, reqGetBannerList, reqGetFloorList} from '/src/api/index'

// home模块的小仓库
// action操作步骤中可以通过API接口获取后端数据
const actions = {
	// 这里从context中解构出commit
	async categoryList({commit}) {
		let result = await reqCategoryList();//获取后端数据
		if (result.code === 200) {
			commit("CATEGORYLIST", result.data)//进入到mutatios中去————方法用大写
		}
	},
	// 这里从context中解构出commit
	async getBannerList({commit}) {
		let result = await reqGetBannerList();//获取后端数据
		// console.log(result)
		if (result.code === 200) {
			commit("GETBANNER", result.data)//进入到mutatios中去————方法用大写
		}
	},
	// 这里从context中解构出commit
	async getFloorList({commit}) {
		let result = await reqGetFloorList();//获取后端数据
		if (result.code === 200) {
			commit("GETFLOOR", result.data)//将数据提交到mutations中去————方法用大写
		}
	}
}

const mutations = {
	CATEGORYLIST(state, categoryList) {
		// 将收到的数据保存到state中去
		state.categoryList = categoryList;//将数据放入到state中去
	},
	GETBANNER(state, bannerList) {
		// 将收到的数据保存到state中去
		state.bannerList = bannerList;//将数据放入到state中去
	},
	GETFLOOR(state, FloorList) {
		// 将收到的数据保存到state中去
		state.floorList = FloorList;//将数据放入到state中去
	},
}

const state = {
	categoryList: [],
	bannerList: [],
	floorList: []
}

// 这个就像computed计算属性一样
const getters = {}

export default {
	// 要先开启命名空间
	namespaced: true,
	actions,
	mutations,
	state,
	getters
}