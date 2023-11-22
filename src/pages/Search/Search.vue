<template>
	<div>
		<TypeNav></TypeNav>
		<div class="main">
			<div class="py-container">
				<!--bread-->
				<div class="bread">
					<ul class="fl sui-breadcrumb">
						<li>
							<a href="#">全部结果</a>
						</li>
					</ul>
					<ul class="fl sui-tag">
						<!--分类面包屑-->
						<li class="with-x" v-show="searchParams.categoryName">{{ searchParams.categoryName }}<i
								@click="removeCategoryName">×</i></li>
						<!--关键字面包屑-->
						<li class="with-x" v-show="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">×</i>
						</li>
						<!--品牌面包屑-->
						<li class="with-x" v-show="searchParams.trademark">{{ searchParams.trademark.split(":")[1] }}<i
								@click="removeTrademark">×</i></li>
						<!--平台属性-->
						<li class="with-x" v-for="(item,index) in searchParams.props" :key="index">{{ item.split(":")[1] }}<i
								@click="removeAttr(index)">×</i>
						</li>
					</ul>
				</div>

				<!--selector子组件-->
				<SearchSelector/>

				<!--details-->
				<div class="details clearfix">
					<div class="sui-navbar">
						<!--这里要通过这些东西进行“排序操作”-->
						<div class="navbar-inner filter">
							<ul class="sui-nav" @click="orderList">
								<li ref="li" class="active">
									<a href="#" data-id="1">综合<span class="iconfont icon-down"></span></a>
								</li>
								<li>
									<a href="#" data-id="2">价格<span></span></a>
								</li>
							</ul>
						</div>
					</div>
					<!--销售产品列表-->
					<div class="goods-list">
						<ul class="yui3-g">
							<li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
								<div class="list-wrap">
									<div class="p-img">
										<router-link :to="`/detail/${goods.id}`"><img :src="goods.defaultImg"/></router-link>
									</div>
									<div class="price">
										<strong><em>¥</em><i>{{ goods.price }}</i></strong>
									</div>
									<div class="attr">
										<a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">
											{{ goods.title }}
										</a>
									</div>
									<div class="commit">
										<i class="command">已有<span>2000</span>人评价</i>
									</div>
									<div class="operate">
										<a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
										<a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
									</div>
								</div>
							</li>
						</ul>
					</div>

					<!--分页————封装为全局组件（很多个地方都学要使用）-->
					<Paginations :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import {mapGetters, mapState} from "vuex";


export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: "Search",
	data() {
		return {
			searchParams: {
				// 一级分类ID
				category1Id: "",
				// 二级分类ID
				category2Id: "",
				// 三级分类ID
				category3Id: "",
				// 选中分类的名字`
				categoryName: "",
				// search关键字
				keyword: "",
				// 排序-----默认为"综合：降序"
				order: "1:desc",
				// 分页器页码--默认展示第1页
				pageNo: 1,
				// 每页展示数据的个数
				pageSize: 10,
				// 平台售卖属性操作带的参数
				props: [],
				// 品牌
				trademark: ""
			},
		}
	},
	components: {
		SearchSelector,
	},
	computed: {
		...mapGetters("search", ["goodsList"]),
		...mapState("search", {
			total: (state) => state.searchList.total,
		})
	},
	methods: {
		//  向服务器发送请求（根据参数不同返回不同的数据）
		getSearchData() {
			// 先重置一下之前的searchParams参数(合并参数)
			Object.assign(this.searchParams, this.$route.query, this.$route.params)
			// 发送请求
			this.$store.dispatch("search/GetSearchInfo", this.searchParams);
		},
		// 删除query参数并且跳转页面刷新地址栏
		removeCategoryName() {
			/**
			 * 删除参数
			 * 再一次请求并展示数据
			 * undefined的字段就不会向服务器传递了
			 */
			this.searchParams.categoryName = undefined;
			this.searchParams.category1Id = undefined;
			this.searchParams.category2Id = undefined;
			this.searchParams.category3Id = undefined;
			// this.$store.dispatch("search/GetSearchInfo", this.searchParams)
			//  修改地址栏——————重新跳转一下到自己
			let location = {
				name: 'search',
			}
			if (this.$route.params) {
				location.params = this.$route.params;
			}
			this.$router.push(location)
		},
		// 删除params参数并且跳转页面刷新地址栏
		removeKeyword() {
			this.searchParams.keyword = undefined;
			let location = {
				name: 'search',
			}
			if (this.$route.query) {
				location.query = this.$route.query;
			}
			/**
			 * 这里只用写页面跳转，不用写数据请求，因为在页面跳转后会自动调用getSearchData（）方法去获取数据
			 * 这里使用路径跳转是因为需要改变路径上的值，所以只能进行页面跳转（自己跳自己）
			 */
			this.$router.push(location);
			this.$bus.$emit("removeKeyword");
		},
		// 删除商品名号并重新请求数据
		removeTrademark() {
			this.searchParams.trademark = "";
			this.getSearchData()
		},
		// 删除商品信息并重新请求数据
		removeAttr(index) {
			// 这里删除了一个参数以后，就需要再次根据现存的参数进行数据请求
			this.searchParams.props.splice(index, 1)
			//	数据请求
			this.getSearchData()
		},
		//获取兄弟节点
		findSibling(tag) {
			let parentEl = tag.parentNode;
			let childs = parentEl.children;
			let siblings = [];
			for (let i = 0; i <= childs.length - 1; i++) {
				if (childs[i] === tag) {
					continue;
				}
				siblings[siblings.length] = childs[i];
			}
			return siblings;
		},
		/**
		 * todo 需要优化一下排序代码中的元素选择操作
		 * 这个函数主要是用于给排序的按钮添加样式class：red up down
		 * @param e
		 */
		orderClass(e) {
			// 移除所有样式
			let arr = this.findSibling(e.target.parentNode);
			let order = this.searchParams.order.split(":")[1];
			//移除样式<span>标签class样式
			arr.forEach((li) => {
				li.classList.remove("active");
				let span = li.children[0].children[0]
				span.classList.remove("icon-up");
				span.classList.remove("icon-down");
			})
			// 给<li>添加active样式
			e.target.parentNode.classList.add("active");
			//desc--降序   asc--升序   给<span>添加字体图标样式
			if (order == "asc") {
				e.target.children[0].classList.add("iconfont", "icon-up");
			} else if (order == "desc") {
				e.target.children[0].classList.add("iconfont", "icon-down");
			}
		},
		/**
		 * 这个函数用于判断点击的按钮为哪一个，并且将值传递到searchParams.order中去
		 * 然后调用添加样式的函数
		 * 1、判断点击的是哪一个排列方式 1: 综合,2: 价格 asc: 升序,desc: 降序（默认为desc）
		 *       2、将判断好的数据放回到searchParams.order中去
		 *       3、再次点击的时候就需要改变升序和降序了（数据取反可以实现）
		 *       4、再次将数据放回到order中
		 *       5、调用添加class样式的函数时需要将升序或者降序传到函数中去
		 *       6、还需要重新发送请求
		 * @param e
		 */
		orderList(e) {
			// 获取原始状态
			let originFlag = this.searchParams.order.split(":")[0]; // 1/2
			let originSort = this.searchParams.order.split(":")[1]; // desc/asc
			// console.log(e.target.dataset.id)
			// console.log(originFlag, ":", originSort)
			let order;
			// 如果相同则说明点击的是同一个对象
			if (e.target.dataset.id === originFlag) {
				// 这里就需要对排列方式进行取反了
				/*if (originSort === "desc") {
					order = "asc"
				} else if (originSort === "asc") {
					order = "desc"
				}*/
				order = originSort === "desc" ? "asc" : "desc";
				this.searchParams.order = `${originFlag}:${order}`
			} else if (e.target.dataset.id !== originFlag) {
				//  如果不等就需要将id赋值到searchParams.order中去并把sort默认为desc
				this.searchParams.order = `${e.target.dataset.id}:desc`
			}
			// 传递事件对象————修改样式
			this.orderClass(e);
			//  重新发送请求
			this.getSearchData();
		}
	},

	watch: {
		/**
		 * 通过监听路由的变化进行数据的获取,如果路由信息发生变化则需要再次向后端发送请求
		 */
		$route: {
			immediate: true,
			handler() {
				// Object.assign(this.searchParams, this.$route.query, this.$route.params)
				this.getSearchData()

				//  每次请求完毕之后就要将1id、2id、3id置为空
				this.searchParams.category1Id = undefined;
				this.searchParams.category2Id = undefined;
				this.searchParams.category3Id = undefined;
			}
		}
	},
	mounted() {
		// 品牌信息参数收集
		this.$bus.$on("trademark", (trademark) => {
			// "ID:品牌名称"__trademark的数据样式
			this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
			//  发送请求
			this.getSearchData()
		});
		// 平台属性参数收集
		this.$bus.$on("attrsList", (attr, attrValue) => {
			/**
			 * 1、整理参数
			 * 2、发送请求
			 */
					// 这里要进行数组去重
			let str = `${attr.attrId}:${attrValue}:${attr.attrName}`;
			if (this.searchParams.props.indexOf(str) === -1) {
				this.searchParams.props.push(str);
				this.getSearchData();
			}
		});
		//	获取分页器当前页码
		this.$bus.$on("getPageNo", (pageno) => {
			this.searchParams.pageNo = pageno;
			// 重新根据当前页码进行数据请求
			this.getSearchData()
		})
	},
	beforeDestroy() {
		this.$bus.$off("removeKeyword")
	}
}
</script>

<style lang="less" scoped>
.main {
	margin: 10px 0;

	.py-container {
		width: 1200px;
		margin: 0 auto;

		.bread {
			margin-bottom: 5px;
			overflow: hidden;

			.sui-breadcrumb {
				padding: 3px 15px;
				margin: 0;
				font-weight: 400;
				border-radius: 3px;
				float: left;

				li {
					display: inline-block;
					line-height: 18px;

					a {
						color: #666;
						text-decoration: none;

						&:hover {
							color: #4cb9fc;
						}
					}
				}
			}

			.sui-tag {
				margin-top: -5px;
				list-style: none;
				font-size: 0;
				line-height: 0;
				padding: 5px 0 0;
				margin-bottom: 18px;
				float: left;

				.with-x {
					font-size: 12px;
					margin: 0 5px 5px 0;
					display: inline-block;
					overflow: hidden;
					color: #000;
					background: #f7f7f7;
					padding: 0 7px;
					height: 20px;
					line-height: 20px;
					border: 1px solid #dedede;
					white-space: nowrap;
					transition: color 400ms;
					cursor: pointer;

					i {
						margin-left: 10px;
						cursor: pointer;
						font: 400 14px tahoma;
						display: inline-block;
						height: 100%;
						vertical-align: middle;
					}

					&:hover {
						color: #28a3ef;
					}
				}
			}
		}

		.details {
			margin-bottom: 5px;

			.sui-navbar {
				overflow: visible;
				margin-bottom: 0;

				.filter {
					min-height: 40px;
					padding-right: 20px;
					background: #fbfbfb;
					border: 1px solid #e2e2e2;
					padding-left: 0;
					border-radius: 0;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

					.sui-nav {
						position: relative;
						left: 0;
						display: block;
						float: left;
						margin: 0 10px 0 0;

						li {
							float: left;
							line-height: 18px;

							a {
								display: block;
								cursor: pointer;
								padding: 11px 15px;
								color: #777;
								text-decoration: none;
							}

							&.active {
								a {
									background: #e1251b;
									color: #fff;
								}
							}
						}
					}
				}
			}

			.goods-list {
				margin: 20px 0;

				ul {
					display: flex;
					flex-wrap: wrap;

					li {
						height: 100%;
						width: 20%;
						margin-top: 10px;
						line-height: 28px;

						.list-wrap {
							.p-img {
								padding-left: 15px;
								width: 215px;
								height: 255px;

								a {
									color: #666;

									img {
										max-width: 100%;
										height: auto;
										vertical-align: middle;
									}
								}
							}

							.price {
								padding-left: 15px;
								font-size: 18px;
								color: #c81623;

								strong {
									font-weight: 700;

									i {
										margin-left: -5px;
									}
								}
							}

							.attr {
								padding-left: 15px;
								width: 85%;
								overflow: hidden;
								margin-bottom: 8px;
								min-height: 38px;
								cursor: pointer;
								line-height: 1.8;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;

								a {
									color: #333;
									text-decoration: none;
								}
							}

							.commit {
								padding-left: 15px;
								height: 22px;
								font-size: 13px;
								color: #a7a7a7;

								span {
									font-weight: 700;
									color: #646fb0;
								}
							}

							.operate {
								padding: 12px 15px;

								.sui-btn {
									display: inline-block;
									padding: 2px 14px;
									box-sizing: border-box;
									margin-bottom: 0;
									font-size: 12px;
									line-height: 18px;
									text-align: center;
									vertical-align: middle;
									cursor: pointer;
									border-radius: 0;
									background-color: transparent;
									margin-right: 15px;
								}

								.btn-bordered {
									min-width: 85px;
									background-color: transparent;
									border: 1px solid #8c8c8c;
									color: #8c8c8c;

									&:hover {
										border: 1px solid #666;
										color: #fff !important;
										background-color: #666;
										text-decoration: none;
									}
								}

								.btn-danger {
									border: 1px solid #e1251b;
									color: #e1251b;

									&:hover {
										border: 1px solid #e1251b;
										background-color: #e1251b;
										color: white !important;
										text-decoration: none;
									}
								}
							}
						}
					}
				}
			}

		}
	}
}
</style>