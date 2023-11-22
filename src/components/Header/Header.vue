<template>
	<!-- 头部 -->
	<header class="header">
		<!-- 头部的第一行 -->
		<div class="top">
			<div class="container">
				<div class="loginList">
					<p>尚品汇欢迎您！</p>
					<p v-if="!userName">
						<span>请</span>
						<!-- 这里只是再点击登录/注册后跳转到登录/注册页面，不需要其他操作，所以不用编程式导航 -->
						<router-link to="/login">登录</router-link>
						<router-link to="/register" class="register">免费注册</router-link>
					</p>
					<p v-else>
						<span>{{ userName }}</span>
						<a class="register pointer" @click="logOut">退出登录</a>
					</p>
				</div>
				<div class="typeList">
					<a href="###">我的订单</a>
					<a @click="goShopCart">我的购物车</a>
					<a href="###">我的尚品汇</a>
					<a href="###">尚品汇会员</a>
					<a href="###">企业采购</a>
					<a href="###">关注尚品汇</a>
					<a href="###">合作招商</a>
					<a href="###">商家后台</a>
				</div>
			</div>
		</div>
		<!--头部第二行 搜索区域-->
		<div class="bottom">
			<h1 class="logoArea">
				<router-link class="logo" to="/home">
					<img src="./images/logo.png" alt=""/>
				</router-link>
			</h1>
			<div class="searchArea">
				<form action="###" class="searchForm">
					<input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyWord"
								 @keyup.enter="goSearch"/>
					<!-- 这里在点击搜索后需要跳到搜索页面，并且要把输入框中的数据一起带过去，所以需要使用push编程式导航 -->
					<!-- 编程式导航 -->
					<button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
				</form>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	name: "Header",
	data() {
		return {
			// 双向数据绑定
			keyWord: "",
		};
	},
	computed: {
		userName() {
			return this.$store.state.user.userInfo.name;
		}
	},
	methods: {
		/**
		 * 点击搜索按钮跳转到搜索页面
		 */
		goSearch() {
			if (!this.keyWord) return;
			// if (this.$route.name === "search") return;
			this.$router.push({
				// 跳转页面的name（因为这里使用了params所以不能使用path进行跳转）
				name: "search",
				// 这里要看有没有query参数（也就是下拉列表是否被选中了），如果有的话就要在搜索的时候把query参数一起带上（这里有没有都带上了，淦）
				query: this.$route.query,
				params: {
					keyword: this.keyWord || undefined || "",
				},
			});
			// 将输入框置空
			// this.keyWord = "";
		},
		/**
		 * 用户退出登录
		 */
		async logOut() {
			try {
				//	向服务器发送退出登录请求，方便服务器进行数据删除
				await this.$store.dispatch("user/userLogOut");
				//	清空localstorage中的TOKEN
				localStorage.removeItem("TOKEN");
				// 路由跳转到首页
				this.$router.push({
					name: 'home'
				})
				// 刷新页面
				location.reload();
			} catch (e) {
				alert(e.message)
			}
		},
		/**
		 * 跳转到购物车
		 */
		goShopCart() {
			this.$router.push({
				name: 'shopcart'
			})
		}
	},
	mounted() {
		this.$bus.$on("removeKeyword", () => {
			this.keyWord = "";
		});
		/**
		 * 获取用户信息（token）
		 */
		this.$store.dispatch("user/getUserInfo");
	}
};
</script>

<style scoped lang="less">
.header {

	& > .top {
		background-color: #eaeaea;
		height: 30px;
		line-height: 30px;

		.container {
			width: 1200px;
			margin: 0 auto;
			overflow: hidden;

			.loginList {
				float: left;

				.pointer {
					cursor: pointer;
				}

				p {
					float: left;
					margin-right: 10px;

					.register {
						border-left: 1px solid #b3aeae;
						padding: 0 5px;
						margin-left: 5px;
					}

				}
			}

			.typeList {
				float: right;

				a {
					padding: 0 10px;
					cursor: pointer;

					& + a {
						border-left: 1px solid #b3aeae;
					}
				}
			}
		}
	}

	& > .bottom {
		width: 1200px;
		margin: 0 auto;
		overflow: hidden;

		.logoArea {
			float: left;

			.logo {
				img {
					width: 175px;
					margin: 25px 45px;
				}
			}
		}

		.searchArea {
			float: right;
			margin-top: 35px;

			.searchForm {
				overflow: hidden;

				input {
					box-sizing: border-box;
					width: 490px;
					height: 32px;
					padding: 0px 4px;
					border: 2px solid #ea4a36;
					float: left;

					&:focus {
						outline: none;
					}
				}

				button {
					height: 32px;
					width: 68px;
					background-color: #ea4a36;
					border: none;
					color: #fff;
					float: left;
					cursor: pointer;

					&:focus {
						outline: none;
					}
				}
			}
		}
	}
}
</style>