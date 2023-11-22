<template>
	<div class="spec-preview" ref="spec">
		<img :src="imgObj.imgUrl"/>
		<!--这个是用来干啥的啊？？？？？-->
		<div class="event" @mousemove="handler"></div>
		<div class="big"><img :src="imgObj.imgUrl" ref="big"/></div>
		<!--蒙板-->
		<div class="mask" ref="mask"></div>
	</div>
</template>

<script>
export default {
	name: "Zoom",
	data() {
		return {
			currentIndex: 0,
		}
	},
	props: ["skuImageList"],
	computed: {
		imgObj() {
			return this.skuImageList[this.currentIndex] || {};
		},
	},
	mounted() {
		this.$bus.$on("DetailImgInfo", (index) => {
			this.currentIndex = parseInt(index)
		})
	},
	methods: {
		/**
		 * handler()————该事件目的在于使得蒙板在图片上移动
		 * @param e
		 */
		handler(e) {
			let mask = this.$refs.mask;
			let big = this.$refs.big;
			// 计算蒙板距离左侧和上侧的距离
			let left = e.offsetX - mask.offsetWidth / 2;
			let top = e.offsetY - mask.offsetWidth / 2;
			let rightlen = this.$refs.spec.offsetWidth - mask.offsetWidth
			let topLen = this.$refs.spec.offsetHeight - mask.offsetHeight

			//	约束一下蒙板的位置，防止蒙板超出边框
			if (left <= 0) left = 0
			else if (left >= rightlen) left = rightlen;
			if (top <= 0) top = 0
			else if (top >= topLen) top = topLen;

			//	将left和top的值赋值给边框
			mask.style.left = left + "px";
			mask.style.top = top + "px";
			// 右侧的放大图片其实是左侧图片的两倍
			big.style.left = -2 * left + "px";
			big.style.top = -2 * top + "px";
		}
	}
}
</script>

<style lang="less">
.spec-preview {
	position: relative;
	width: 400px;
	height: 400px;
	border: 1px solid #ccc;

	img {
		width: 100%;
		height: 100%;
	}

	.event {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 998;
	}

	.mask {
		width: 50%;
		height: 50%;
		background-color: rgba(0, 255, 0, 0.3);
		position: absolute;
		left: 0;
		top: 0;
		display: none;
	}

	.big {
		width: 100%;
		height: 100%;
		position: absolute;
		top: -1px;
		left: 100%;
		border: 1px solid #aaa;
		overflow: hidden;
		z-index: 998;
		display: none;
		background: white;

		img {
			width: 200%;
			max-width: 200%;
			height: 200%;
			position: absolute;
			left: 0;
			top: 0;
		}
	}

	.event:hover ~ .mask,
	.event:hover ~ .big {
		display: block;
	}
}
</style>