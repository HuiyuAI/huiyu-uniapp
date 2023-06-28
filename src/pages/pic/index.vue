<template>
  <view class="container">
    <Pic ref="pic"/>
  </view>
</template>

<script>
import Pic from "./components/pic.vue"

export default {
  components: {Pic},
  data() {
    return {}
  },
  onLoad() {
  },
  onPullDownRefresh() {
    this.$refs.pic.pullDownRefresh()
  },
  onReachBottom() {
    this.$refs.pic.reachBottom()
  },
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
