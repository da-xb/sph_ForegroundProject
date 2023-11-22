<template>
    <div class="swiper-container" id="Swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="carousal in list" :key="carousal.id">
          <img :src="carousal.imgUrl"/>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
    
      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
</template>

<script>
import Swiper from "swiper";

export default {
  name: "Carousal",
  props: ["list"],
  watch: {
    list: {
      immediate: true,
      handler() {
        /**
         * 注：
         * 1、在new对象之前需要确认html中已经存在完整的对象了
         * 2、但是这里由于v-for生成框架时需要时间，所以在数据返回后dom还没有生成完毕，所以即使数据有了依旧无法使用swiper
         * 3、所以这里要使用nextTick：在下一轮dom更新结束后去调用回调函数
         */
        if (this.list.length==0) return;
        this.$nextTick(() => {
          new Swiper("#Swiper", {
            loop: false,
            autoplay: true,
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        })
      }
    }
  }
}
</script>

<style scoped>

</style>