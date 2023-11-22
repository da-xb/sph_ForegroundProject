<template>
	<div class="pagination" @click="getPageNo">
		<button :disabled="pageNo==1">上一页</button>
		<button v-if="consecutivePageNumber.start>1" :class="{active:pageNo==1}">1</button>


		<button v-if="consecutivePageNumber.start>2" disabled>···</button>
		<button v-for="(page,index) in consecutivePageNumber.end" :key="index" v-if="page>=consecutivePageNumber.start"
						:class="{active:pageNo==page}">
			{{ page }}
		</button>
		<button v-if="consecutivePageNumber.end<totalPage-1" disabled>···</button>


		<button v-if="consecutivePageNumber.end<totalPage" :class="{active:pageNo==totalPage}">{{ totalPage }}</button>
		<button :disabled="pageNo==totalPage" @click="getPageNo(pageNo+1)">下一页</button>
		<button style=" margin-left: 30px" disabled>共{{ total }}条</button>
	</div>
</template>

<!--【分页器需要进行哪些操作（数据）】
1、需要知道当前是哪一页		pageNo
2、需要知道每个页面展示多少条数据    pageSize
3、需要知道整个分页器一共有多少条数据————用于展示总页面数量  total   [页面总数=total/pageSize]   向上取整函数 Math.ceil(5.1234);// 6
4、需要知道分页器连续的页码个数：5|7（奇数，对称） continues
-->

<script>
export default {
	name: "Paginations",
	props: ["pageNo", "pageSize", "total", "continues"],
	computed: {
		// 计算出总的页数
		totalPage() {
			return Math.ceil(this.total / this.pageSize)
		},
		// 计算出连续页码的起始数字以及结束数字 start  end
		consecutivePageNumber() {
			let start = 0, end = 0;
			start = this.pageNo - 2;
			end = this.pageNo + 2;
			/*
			连续的页码数至少是5页，当总页数不够5页的时候需要走下面的计算
			 */
			if (this.continues > this.totalPage) {
				start = 1;
				end = this.totalPage;
			} else {
				start = this.pageNo - parseInt(this.continues / 2)
				end = this.pageNo + parseInt(this.continues / 2)
				if (start < 1) {
					start = 1;
					end = this.continues;
				} else if (end > this.totalPage) {
					start = this.totalPage - this.continues + 1;
					end = this.totalPage;
				}
			}

			return {start, end}
		}
	},
	methods: {
		// 获取分页器当前的页码，然后用于请求数据
		//	全局事件总线————提供当前点击的是第几页给search组件
		getPageNo(e) {
			if (e.target.nodeName === "BUTTON") {
				let pageNo;
				let page = e.target.innerHTML;
				if (page === "上一页") {
					pageNo = this.pageNo - 1;
				} else if (page === "下一页") {
					pageNo = this.pageNo + 1;
				} else {
					pageNo = parseInt(page);
				}
				this.$bus.$emit("getPageNo", pageNo)
			}
		}
	},
	beforeDestroy() {
		this.$bus.$off("getPageNo")
	}
}
</script>

<style scoped lang="less">
.pagination {
	text-align: center;

	button {
		margin: 0 5px;
		background-color: #f4f4f5;
		color: #606266;
		outline: none;
		border-radius: 2px;
		padding: 0 4px;
		vertical-align: top;
		display: inline-block;
		font-size: 13px;
		min-width: 35.5px;
		height: 28px;
		line-height: 28px;
		cursor: pointer;
		box-sizing: border-box;
		text-align: center;
		border: 0;

		& [disabled] {
			color: #c0c4cc;
			cursor: not-allowed;
		}
	}

	.active {
		cursor: not-allowed;
		background-color: #409eff;
		color: #fff;
	}
}

</style>

