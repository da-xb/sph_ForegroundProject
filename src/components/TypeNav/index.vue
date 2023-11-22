<template>
	<!-- ————————————全局组件—————————————————————————— -->
	<!-- 商品分类导航 -->
	<div class="type-nav">
		<div class="container">
			<!-- @mouseleave="leaveIndex"——————————当鼠标移走后就要将 index 重新置为 -1
					@mouseenter="show = true"——————————将typeNav展示出来
		 -->
			<div @mouseleave="leaveIndex" @mouseenter="show = true">
				<h2 class="all">全部商品分类</h2>
				<!-- 这里添加一个过渡动画
					transition————过渡动画
				-->
				<transition name="sort">
					<div v-show='show' class="sort">
						<!--
							事件冒泡————进行a标签的路由跳转
							注：可以使用<router-link>方式进行路由跳转，由于<router-link>是一个组件，所以在创建组件实例的时候会出现卡顿
						 -->
						<div class="all-sort-list2" @click="goSearch">
							<!-- 展示数据 begin——————————————————————————-->
							<!--
							注：
							1、:class——————给当前元素去绑定一个cur的样式  当 cur:true 的时候，这个样式就会显示
							2、@mouseenter="changeIndex(index)——————是为了知道当前鼠标是在哪个标签上面
							3、:data-categoryName="c1.categoryName"
							4、:data-category1Id='c1.categoryId'
							 -->
							<div class="item" v-for="(c1, index) in categoryList" :key="c1.categoryID"
									 :class="{ cur: currentIndex == index }">
								<h3 @mouseenter="changeIndex(index)">
									<!-- 通过 data-categoryName 自定义属性，来确保跳转的按钮是a标签，并且是 1 2 3 三级路由跳转-->
									<a :data-categoryName="c1.categoryName" :data-category1Id='c1.categoryId'>{{ c1.categoryName }}</a>
								</h3>

								<!-- 二级目录 begin________ ___________________________ -->
								<!--
									1、v-show="currentIndex==index"————————表示当前鼠标移到这个元素的时候就展示二三级分类
									currentIndex——————保存的是鼠标所在的位置下标
									index————————保存的是当前一级分类的下标
								 -->
								<div class="item-list clearfix" v-show="currentIndex==index">
									<div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
										<dl class="fore">
											<dt>
												<a :data-categoryName="c2.categoryName" :data-category2Id='c2.categoryId'>{{
														c2.categoryName
													}}</a>
											</dt>
											<dd>
												<!-- 三级目录 begin -->
												<em class="fore" v-for="c3 in c2.categoryChild" :key="c3.categoryId">
													<a :data-categoryName="c3.categoryName" :data-category3Id='c3.categoryId'>{{
															c3.categoryName
														}}</a>
												</em>
												<!-- 三级目录 end -->
											</dd>
										</dl>
									</div>
									<!-- 二级目录 end ___________________________________ -->
								</div>
							</div>
							<!-- 展示数据end———————————————————————————————— -->
						</div>
					</div>
				</transition>
			</div>
			<nav class="nav">
				<a href="###">服装城</a>
				<a href="###">美妆馆</a>
				<a href="###">尚品汇超市</a>
				<a href="###">全球购</a>
				<a href="###">闪购</a>
				<a href="###">团购</a>
				<a href="###">有趣</a>
				<a href="###">秒杀</a>
			</nav>

		</div>
	</div>
</template>


<script>
import {mapState} from "vuex"; //用于获取Vuex中state中的数据
import {throttle} from 'lodash'
// import "animate.css"

export default {
	name: "TypeNav",
	data() {
		return {
			currentIndex: -1,   //这个参数用于保存当前鼠标所在标签的index
			show: true,
		};
	},
	methods: {
		/**
		 * 这种写法就是加上了【节流】的功能
		 * throttle-->节流（为了减少事件触发的次数）
		 * changeIndex()——————————————当鼠标移动到当前一级目录时，就将当前目录的index赋值给currentIndex
		 */
		changeIndex: throttle(function (index) {
			// console.log(index);
			this.currentIndex = index;
		}, 50),

		leaveIndex() {

			// 取消蓝色背景样式
			this.currentIndex = -1;
			// 在这里判断一下所在的组件————typeNav是否显示
			if (this.$route.name !== 'home') {
				this.show = false;
			}
		},
		// 跳转到搜索页面----push编程式导航
		goSearch(e) {
			// console.log(e.target.dataset);
			// 从【自定义属性】中将需要的属性解构出来
			let {categoryname, category1id, category2id, category3id} = e.target.dataset;

			// 先判断是否是从a标签进行点击跳转的（因为使用了事件委托）——  因为a标签有自定义属性categoryname
			if (categoryname) {

				/*if (category1id) {
					this.$router.push({
						name: 'search',
						query: {
							category1id,
							categoryname,
						}
					})
				} else if (category2id) {
					this.$router.push({
						name: 'search',
						query: {
							category2id,
							categoryname,
						}
					})
				} else if (category3id) {
					this.$router.push({
						name: 'search',
						query: {
							category3id,
							categoryname,
						}
					})
				}*/

				// 这个对象用来组装跳转时需要带的参数
				let location = {
					name: 'search'
				}

				// 组装一下query对象传入到search模块
				let query = {
					categoryName: categoryname
				}

				// 判断是几级标签
				if (category1id) {
					query.category1Id = category1id;
				} else if (category2id) {
					query.category2Id = category2id;
				} else {
					query.category3Id = category3id;
				}
				// 把query参数先放入到location对象中
				location.query = query;
				/**
				 * 如果传到search路由中的数据有params参数，则要把params参数一起传过去（params参数就是搜索框里面的内容）
				 */
				if (this.$route.params) {
					// 给location对象配置一个params属性对象
					location.params = this.$route.params;
				}
				// 将组装好的location对象传到search路由组件中
				this.$router.push(location)
			}
		}
	},
	computed: {
		// 通过mapState来读取home中state中的数据了
		...mapState("home", ["categoryList"]),
	},
	mounted() {
		/**
		 * 当组件挂载完毕：可以向服务器发送请求数据
		 * 注：
		 * 1、不用在这里继续请求数据了——————已经在APP.vue中请求过数据了(直接缓存了)
		 * 2、因为每次重新加载TypeNav的时候都会再去请求一次后台数据（浪费资源）
		 */
		// this.$store.dispatch("home/categoryLIst")

		// 当跳转到其他页面的时候，重新加载typeNav的时候，mounted也会在执行一遍，这样我们就可以重新给show去赋值了(需要根据条件来决定是否更改show的值)
		// 跳转到search页面的时候，typeNav就会默认隐藏起来
		if (this.$route.name != 'home') {
			this.show = false;
		}
	},
};
</script>


<style lang='less' scoped>
::-webkit-scrollbar {
	/*隐藏滚轮*/
	display: none;
}

a:hover {
	text-decoration: none;
}

.type-nav {
	border-bottom: 2px solid #e1251b;

	.container {
		width: 1200px;
		margin: 0 auto;
		display: flex;
		position: relative;

		.all {
			width: 210px;
			height: 45px;
			background-color: #e1251b;
			line-height: 45px;
			text-align: center;
			color: #fff;
			font-size: 14px;
			font-weight: bold;
		}

		.nav {
			a {
				height: 45px;
				margin: 0 22px;
				line-height: 45px;
				font-size: 16px;
				color: #333;
			}
		}

		.sort {
			// overflow-y: auto;
			position: absolute;
			left: 0;
			top: 45px;
			width: 210px;
			height: 461px;
			position: absolute;
			background: #fafafa;
			z-index: 999;

			.all-sort-list2 {
				height: 100%;
				overflow: auto;

				.item {
					h3 {
						line-height: 30px;
						font-size: 14px;
						font-weight: 400;
						overflow: hidden;
						padding: 0 20px;
						margin: 0;

						a {
							color: #333;
						}
					}

					.item-list {
						// display: none;
						position: absolute;
						width: 734px;
						min-height: 460px;
						background: #f7f7f7;
						left: 210px;
						border: 1px solid #ddd;
						top: 0;
						z-index: 9999 !important;

						.subitem {
							float: left;
							width: 650px;
							padding: 0 4px 0 8px;

							dl {
								border-top: 1px solid #eee;
								padding: 6px 0;
								overflow: hidden;
								zoom: 1;

								&.fore {
									border-top: 0;
								}

								dt {
									float: left;
									width: 54px;
									line-height: 22px;
									text-align: right;
									padding: 3px 6px 0 0;
									font-weight: 700;
								}

								dd {
									float: left;
									width: 415px;
									padding: 3px 0 0;
									overflow: hidden;

									em {
										float: left;
										height: 14px;
										line-height: 14px;
										padding: 0 8px;
										margin-top: 5px;
										border-left: 1px solid #ccc;
									}
								}
							}
						}
					}
				}

				// .item:hover {
				//   background-color: skyblue;
				// }
				.cur {
					background-color: skyblue;
				}
			}
		}

		// 过渡动画
		// 动画进入
		.sort-enter {
			height: 0px;
			// transform: translateY();
		}

		// 动画结束
		.sort-enter-to {
			height: 461px;
		}

		// 定义动画事件、速率
		.sort-enter-active {
			transition: all 0.2s linear;
		}
	}
}
</style>