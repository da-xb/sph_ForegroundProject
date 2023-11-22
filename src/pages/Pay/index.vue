<template>
	<div class="pay-main">
		<div class="pay-container">
			<div class="checkout-tit">
				<h4 class="tit-txt">
					<span class="success-icon"></span>
					<span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
				</h4>
				<div class="paymark">
					<span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
					<span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payInfo.totalFee }}</em></span>
				</div>
			</div>
			<div class="checkout-info">
				<h4>重要说明：</h4>
				<ol>
					<li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
					<li>其它支付渠道正在调试中，敬请期待。</li>
					<li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
				</ol>
				<h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
				<ul>
					<li>支付帐号：11111111</li>
					<li>密码：111111</li>
					<li>支付密码：111111</li>
				</ul>
			</div>
			<div class="checkout-steps">
				<div class="step-tit">
					<h5>支付平台</h5>
				</div>
				<div class="step-cont">
					<ul class="payType">
						<li><img src="./images/pay2.jpg"></li>
						<li><img src="./images/pay3.jpg"></li>
					</ul>

				</div>
				<div class="hr"></div>

				<div class="payshipInfo">
					<div class="step-tit">
						<h5>支付网银</h5>
					</div>
					<div class="step-cont">
						<ul class="payType">
							<li><img src="./images/pay10.jpg"></li>
							<li><img src="./images/pay11.jpg"></li>
							<li><img src="./images/pay12.jpg"></li>
							<li><img src="./images/pay13.jpg"></li>
							<li><img src="./images/pay14.jpg"></li>
							<li><img src="./images/pay15.jpg"></li>
							<li><img src="./images/pay16.jpg"></li>
							<li><img src="./images/pay17.jpg"></li>
							<li><img src="./images/pay18.jpg"></li>
							<li><img src="./images/pay19.jpg"></li>
							<li><img src="./images/pay20.jpg"></li>
							<li><img src="./images/pay21.jpg"></li>
							<li><img src="./images/pay22.jpg"></li>

						</ul>
					</div>

				</div>
				<div class="hr"></div>

				<div class="submit">
					<!--<router-link class="btn" to="/paysuccess">立即支付</router-link>-->
					<a class="btn" @click="open">立即支付</a>
				</div>
				<div class="otherpay">
					<div class="step-tit">
						<h5>其他支付方式</h5>
					</div>
					<div class="step-cont">
						<span><a href="weixinpay.html" target="_blank">微信支付</a></span>
						<span>中国银联</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {reqOrderInfo, reqPayStatus} from "@/api";
import QRCode from "qrcode";

export default {
	name: 'Pay',
	data() {
		return {
			payInfo: {},
			// 定时器
			timer: null,
			// 支付状态码
			payCode: 200,
			// 关闭定时器
			turnOff: false,
		}
	},
	mounted() {
		// 获取支付页面的信息
		this.getOrderInfo();
	},
	computed: {
		// 获取订单的编号
		orderId() {
			return this.$route.query.orderId;
		}
	},
	// watch: {
	// 	payCode: {
	// 		handler(newValue) {
	// 			if (newValue === 200) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// },
	methods: {
		// 获取订单的信息
		async getOrderInfo() {
			let result = await reqOrderInfo(this.$route.query.orderId)
			if (result.code === 200) {
				this.payInfo = result.data || {}
			} else {
				console.log(result.message)
			}
		},
		// elment 弹出框
		open() {
			// 二维码
			QRCode.toDataURL(this.payInfo.codeUrl)
					.then(url => {
						/**
						 * 从服务器获取当前支付的状态 成功--跳转页面  失败--显示错误
						 * 这里需要一直到服务器获取支付状态，所以这里需要一直循环的去获取状态（我认为可以在点击确认按钮后再去获取状态，不过似乎不正规）
						 * 开启一个定时器用于循环获取支付状态
						 * @type {boolean}
						 */
						this.turnOff = false;
						if (!this.timer) {
							this.timer = setInterval(async () => {
								//	发送请求(用来判断是否完成支付)
								let result = await reqPayStatus(this.orderId);
								console.log(result)
								/**
								 * this.turnOff === true(这个时自己设置的开关)
								 * 这里只是为了自己方便测试，自建的一个定时器开关(这个就表示完成了支付)
								 */
								// this.payCode = 200;  // 测试
								if (result.code === 200) {
									//	清除定时器
									clearInterval(this.timer);
									this.timer = null;
									// 保存支付成功的code，用于确认按键 时进行判断
									// this.payCode = result.Code;
									// this.payCode = 200;// todo 这里存在优化的问题,由于延时器无法实时更新data中的payCode数据,这就导致确认按钮无法使用

									//	跳转到支付成功的页面
									this.$router.push({
										path: '/paysuccess'
									})
								}
							}, 1000)
						}
						/**
						 * todo 这里我觉得判断是否支付的api接口应该放在确认按钮中,这样可以不用一直向服务器发送请求(我觉得需要优化一下)
						 * 这里有bug,我好难受啊
						 */
						// 弹出框
						this.$alert(`<img src=${url} alt="微信支付二维码"/>`, '微信支付', {
							dangerouslyUseHTMLString: true,
							// 居中布局
							center: true,
							// 显示取消按钮
							showCancelButton: true,
							// 取消按钮的文本内容
							cancelButtonText: '支付遇见问题',
							confirmButtonText: '支付成功',
							// 右上角关闭按钮
							showClose: false,
							/*beforeClose: (action, instance, done) => {
															/!*if (action === 'confirm') {
																instance.confirmButtonLoading = true;
																instance.confirmButtonText = '执行中...';
																setTimeout(() => {
																	done();
																	setTimeout(() => {
																		instance.confirmButtonLoading = false;
																	}, 300);
																}, 3000);
															} else {
																done();
															}*!/
															if (action === 'cancel') {
																alert('支付失败,请联系管理员');
																//	将定时器关闭(避免继续向服务器请求数据)
																clearInterval(this.timer)
																this.timer = null;
																// 关闭弹窗
																done();
															} else {
																if (this.payCode === 200) {
																	//	点击了确定按钮
																	//	将定时器关闭(避免继续向服务器请求数据)
																	clearInterval(this.timer)
																	this.timer = null;
																	// 关闭弹窗
																	done();
																	this.$router.push({
																		name: 'paysuccess'
																	})
																}
															}
														}*/
						}).then(() => {
							// 关闭定时器
							// this.turnOff = true;
							clearInterval(this.timer);
							this.timer = null;
							// 支付成功后需要进行的操作
							if (this.payCode === 200) {
								// console.log(111)
								//	跳转到支付成功的页面
								this.$router.push({
									path: '/paysuccess'
								})
							}
						}).catch(() => {
							clearInterval(this.timer);
							this.timer = null;
							alert('支付遇见问题,请及时联系客服')
						});
					})
		}
	}
}
</script>

<style lang="less" scoped>
.pay-main {
	margin-bottom: 20px;

	.pay-container {
		margin: 0 auto;
		width: 1200px;

		a:hover {
			color: #4cb9fc;
		}

		.orange {
			color: #e1251b;
		}

		.money {
			font-size: 18px;
		}

		.zfb {
			color: #e1251b;
			font-weight: 700;
		}

		.checkout-tit {
			padding: 10px;

			.tit-txt {
				font-size: 14px;
				line-height: 21px;

				.success-icon {
					width: 30px;
					height: 30px;
					display: inline-block;
					background: url(./images/icon.png) no-repeat 0 0;
				}

				.success-info {
					padding: 0 8px;
					line-height: 30px;
					vertical-align: top;
				}
			}

			.paymark {
				overflow: hidden;
				line-height: 26px;
				text-indent: 38px;

				.fl {
					float: left;
				}

				.fr {
					float: right;

					.lead {
						margin-bottom: 18px;
						font-size: 15px;
						font-weight: 400;
						line-height: 22.5px;
					}
				}
			}
		}

		.checkout-info {
			padding-left: 25px;
			padding-bottom: 15px;
			margin-bottom: 10px;
			border: 2px solid #e1251b;

			h4 {
				margin: 9px 0;
				font-size: 14px;
				line-height: 21px;
				color: #e1251b;
			}

			ol {
				padding-left: 25px;
				list-style-type: decimal;
				line-height: 24px;
				font-size: 14px;
			}

			ul {
				padding-left: 25px;
				list-style-type: disc;
				line-height: 24px;
				font-size: 14px;
			}
		}

		.checkout-steps {
			border: 1px solid #ddd;
			padding: 25px;

			.hr {
				height: 1px;
				background-color: #ddd;
			}

			.step-tit {
				line-height: 36px;
				margin: 15px 0;
			}

			.step-cont {
				margin: 0 10px 12px 20px;

				ul {
					font-size: 0;

					li {
						margin: 2px;
						display: inline-block;
						padding: 5px 20px;
						border: 1px solid #ddd;
						cursor: pointer;
						line-height: 18px;
					}
				}
			}
		}

		.submit {
			text-align: center;

			.btn {
				display: inline-block;
				padding: 15px 45px;
				margin: 15px 0 10px;
				font: 18px "微软雅黑";
				font-weight: 700;
				border-radius: 0;
				background-color: #e1251b;
				border: 1px solid #e1251b;
				color: #fff;
				text-align: center;
				vertical-align: middle;
				cursor: pointer;
				user-select: none;
				text-decoration: none;
			}
		}
	}
}
</style>