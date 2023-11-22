<template>
  <div>
    <!-- TypeNav被定义为全局组件了，再main.js中被引入————所以这里不用在单独引入了-->
    <typeNav></typeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="floor in floorList" :key="floor.id" :floorList="floor"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>

import ListContainer from "@/pages/Home/ListContainer";
import Recommend from "@/pages/Home/Recommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";
import {mapState} from "vuex";

export default {
  name: "Home",
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    this.$store.dispatch("home/getFloorList")
  },
  computed: {
    ...mapState("home", ["floorList"])
  },
};
</script>

