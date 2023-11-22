<template>
  <div>
    <!-- 头部区域（不需要路由来进行局部的更新） -->
    <Header v-if="$route.meta.showHeader"></Header>

    <!-- 使用路由进行路由跳转 -->
    <router-view></router-view>

    <!-- 尾部区域（不需要路由来进行局部的更新） -->
    <!-- 在登录和注册页面隐藏，在home和search页面是显示的 -->
    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";
import Vue from "vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  beforeCreate() {
    // 全局事件总线
    Vue.prototype.$bus = this;
  },
  mounted() {
    // 通知vuex发送请求，获取数据，存储到对应的仓库中去-------将这个请求数据的代码放到根组件中，这样可以避免重复的去发送请求
    // 然后将获取到的数据直接放到vuex的仓库中去，所以不管在哪个组件都可以使用仓库中的数据了
    this.$store.dispatch("home/categoryList");
  }
};
</script>

<style>
</style>