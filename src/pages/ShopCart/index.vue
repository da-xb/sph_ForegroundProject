<template>
	<div class="cart">
		<h4>全部商品</h4>
		<div class="cart-main">
			<div class="cart-th">
				<div class="cart-th1">全部</div>
				<div class="cart-th2">商品</div>
				<div class="cart-th3">单价（元）</div>
				<div class="cart-th4">数量</div>
				<div class="cart-th5">小计（元）</div>
				<div class="cart-th6">操作</div>
			</div>
			<div class="cart-body">
				<ul class="cart-list" v-for="item in cartInfoList" :key="item.id">
					<li class="cart-list-con1">
						<input type="checkbox" name="chk_list" :checked="item.isChecked==1" @change="updateChecked(item,$event)">
					</li>
					<li class="cart-list-con2">
						<img :src="item.imgUrl">
						<div class="item-msg">{{ item.skuName }}</div>
					</li>
					<li class="cart-list-con4">
						<span class="price">{{ item.skuPrice }}</span>
					</li>
					<li class="cart-list-con5">
						<a class="mins" @click="handler('minus',-1,item)">-</a>
						<input autocomplete="off" type="text" :value="item.skuNum" minnum="1" class="itxt"
									 @change="handler('change',$event.target.value*1,item)">
						<a class="plus" @click="handler('add',1,item)">+</a>
					</li>
					<li class="cart-list-con6">
						<span class="sum">{{ item.skuPrice * item.skuNum }}</span>
					</li>
					<li class="cart-list-con7">
						<a @click="deleteCartById(item)">删除</a>
						<br>
						<a>移到收藏</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="cart-tool">
			<div class="select-all">
				<label><input class="chooseAll" type="checkbox" :checked="isAllChecked" @change="chooseAll">全选</label>
			</div>
			<div class="option">
				<a @click="deleteCheckProduct">删除选中的商品</a>
				<a>移到我的关注</a>
				<a>清除下柜商品</a>
			</div>
			<div class="money-box">
				<div class="chosed">已选择
					<span>{{ productNumeber() }}</span>件商品
				</div>
				<div class="sumprice">
					<em>总价（不含运费） ：</em>
					<i class="summoney">{{ totalPrice() }}</i>
				</div>
				<div class="sumbtn">
					<a class="sum-btn pointer" @click="goTrade">结算</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapGetters} from "vuex";
import {throttle} from "lodash";

export default {
	name: 'ShopCart',
	mounted() {
		this.getCartListData();
	},
	computed: {
		...mapGetters("cartList", ["cartList"]),
		//	购物车所需要的数据
		cartInfoList() {
			return this.cartList.cartInfoList || [];
		},
		/**
		 * 判断底部复选框是否勾选（全部商品勾选则勾选）
		 * 这里使用计算属性的原因是——————当cartInfoList中的数据发生变化的时候，会自动执行isAllChecked并重新计算
		 * @returns {*}
		 */
		isAllChecked() {
			let temp;
			if (this.cartInfoList.length == 0) {
				temp = false;
			} else {
				temp = this.cartInfoList.every(item => {
					return item.isChecked == 1;
				})
			}
			return temp;
		},
	},
	methods: {
		// 从服务器获取个人购物车数据（所以这里需要判断用户）（鉴权）
		getCartListData() {
			this.$store.dispatch("cartList/getCartList");
		},
		// 计算购买产品的总价
		totalPrice() {
			let sum = 0;
			/*this.cartInfoList.filter(item => {
				return item.isChecked == 1
			}).reduce()*/
			this.cartInfoList.forEach(item => {
				if (item.isChecked == 1) {
					sum += item.skuPrice * item.skuNum
				}
			})
			return sum;
		},
		// 计算购物车商品的数量
		productNumeber() {
			let num = 0;
			this.cartInfoList.forEach(cart => {
				if (cart.isChecked == 1) {
					num++;
				}
			})
			return num;
		},

		/**
		 * 修改购物车中产品的个数
		 *@disNUm + 变化亮（1）    - 变化量（-1）  input最终的输入个数（手动输入的值，需要计算一下变化量）
		 * @cart 表示当前修改的是哪一个产品的数量
		 */
		handler: throttle(async function (type, disNum, cart) {
			//	判断type
			switch (type) {
				case 'minus':
					// 要先判断产品的数量是否会小于1，之后才能进行服务器数据的发送
					disNum = cart.skuNum > 1 ? -1 : 0;
					break;
				case 'change':
					disNum = (isNaN(disNum) || disNum < 1) ? 0 : Math.floor(disNum) - cart.skuNum;
					break;
				case 'add':
					// 带给服务器变化的量
					disNum = 1;
					break;
			}
			try {
				await this.$store.dispatch("detail/addOrUpdateShopCart", {
					skuId: cart.skuId,
					skuNum: disNum
				})
				//	成功之后再次获取数据，用以更新页面数据
				this.$store.dispatch("cartList/getCartList")
			} catch (error) {
				alert(error.message)
			}
		}, 800),
		/**
		 * 更具Id去删除购物车中的商品
		 * @param cart
		 * @returns {Promise<void>}
		 */
		async deleteCartById(cart) {
			try {
				// 这里要把要删除的对象的id发送到后端，后端删除后给我们一个确认——————所以我们必须等到确认后在去后端获取数据，否则在删除的过程中获取的数据是错误的数据
				await this.$store.dispatch("cartList/deleteCart", cart.skuId)
				// 重新获取数据渲染页面
				this.getCartListData();
			} catch (e) {
				alert(e.message);
			}
		},
		/**
		 * 更改isChecked的状态
		 * @param cart 商品对象
		 */
		async updateChecked(cart, event) {
			// 把skuId和isChecked发送给后端---成功后则发送请求获取购物车数据，失败则弹出失败提示框
			try {
				let checked = event.target.checked ? "1" : "0";
				/**todo 数据返回这里还需要在思考一下
				 * 这里别忘了啊，一定要等到数据返回啊
				 */
				await this.$store.dispatch("cartList/updateCheckedById", {skuId: cart.skuId, isChecked: checked})
				//	重新获取购物车数据
				this.getCartListData();
			} catch (e) {
				alert(e.message)
			}
		},
		/**
		 * 删除所有被选中的商品
		 */
		async deleteCheckProduct() {
			try {
				for (const item of this.cartInfoList) {
					if (item.isChecked === 1) {
						await this.$store.dispatch("cartList/deleteCart", item.skuId)
					}
				}
				// 在删除成功后-------获取购物车的数据
				this.getCartListData()
			} catch (e) {
				alert(e.message)
			}
		},
		/**
		 * 全选按钮勾选和取消操作
		 */
		async chooseAll(e) {
			try {
				let checked = e.target.checked ? "1" : "0";
				// 等待传回来的结果，然后在开始下一步操作
				await this.$store.dispatch("cartList/chooseAll", checked)
				//	成后修改后需要重新获取数据来渲染页面
				this.getCartListData()
			} catch (e) {
				alert(e.message)
			}
		},

		/**
		 * 跳转到支付页面
		 */
		goTrade() {
			this.$router.push({
				name: 'trade'
			})
		}
	}
}
</script>

<style lang="less" scoped>
.pointer {
	cursor: pointer;
}

.cart {
	width: 1200px;
	margin: 0 auto;

	h4 {
		margin: 9px 0;
		font-size: 14px;
		line-height: 21px;
	}

	.cart-main {
		.cart-th {
			background: #f5f5f5;
			border: 1px solid #ddd;
			padding: 10px;
			overflow: hidden;

			& > div {
				float: left;
			}

			.cart-th1 {
				width: 25%;

				input {
					vertical-align: middle;
				}

				span {
					vertical-align: middle;
				}
			}

			.cart-th2 {
				width: 25%;
			}

			.cart-th3,
			.cart-th4,
			.cart-th5,
			.cart-th6 {
				width: 12.5%;

			}
		}

		.cart-body {
			margin: 15px 0;
			border: 1px solid #ddd;

			.cart-list {
				padding: 10px;
				border-bottom: 1px solid #ddd;
				overflow: hidden;

				& > li {
					float: left;
				}

				.cart-list-con1 {
					width: 15%;
				}

				.cart-list-con2 {
					width: 35%;

					img {
						width: 82px;
						height: 82px;
						float: left;
					}

					.item-msg {
						float: left;
						width: 150px;
						margin: 0 10px;
						line-height: 18px;
					}
				}

				.cart-list-con4 {
					width: 10%;

				}

				.cart-list-con5 {
					width: 17%;

					.mins {
						border: 1px solid #ddd;
						border-right: 0;
						float: left;
						color: #666;
						width: 6px;
						text-align: center;
						padding: 8px;
					}

					input {
						border: 1px solid #ddd;
						width: 40px;
						height: 33px;
						float: left;
						text-align: center;
						font-size: 14px;
					}

					.plus {
						border: 1px solid #ddd;
						border-left: 0;
						float: left;
						color: #666;
						width: 6px;
						text-align: center;
						padding: 8px;
					}
				}

				.cart-list-con6 {
					width: 10%;

					.sum {
						font-size: 16px;
					}
				}

				.cart-list-con7 {
					width: 13%;


					a {
						color: #666;
						cursor: pointer;
					}
				}
			}
		}
	}

	.cart-tool {
		overflow: hidden;
		border: 1px solid #ddd;

		.select-all {
			padding: 10px;
			overflow: hidden;
			float: left;

			span {
				vertical-align: middle;
			}

			input {
				vertical-align: middle;
			}
		}

		.option {
			padding: 10px;
			overflow: hidden;
			float: left;

			a {
				cursor: pointer;
				float: left;
				padding: 0 10px;
				color: #666;
			}
		}

		.money-box {
			float: right;

			.chosed {
				line-height: 26px;
				float: left;
				padding: 0 10px;
			}

			.sumprice {
				width: 200px;
				line-height: 22px;
				float: left;
				padding: 0 10px;

				.summoney {
					color: #c81623;
					font-size: 16px;
				}
			}

			.sumbtn {
				float: right;

				a {
					display: block;
					position: relative;
					width: 96px;
					height: 52px;
					line-height: 52px;
					color: #fff;
					text-align: center;
					font-size: 18px;
					font-family: "Microsoft YaHei";
					background: #e1251b;
					overflow: hidden;
				}
			}
		}
	}
}
</style>