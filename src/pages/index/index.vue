<template>
  <view>
    <!-- 通知 -->
    <view class="notice" v-if="noticeList.length">
      <u-notice-bar mode="vertical" duration="3000" type="none" :list="noticeList" color="#969696"></u-notice-bar>
    </view>
    <!-- tab-item -->
    <Draw/>
  </view>
</template>

<script>
import Draw from "./components/draw.vue"

export default {
  components: {Draw},
  data() {
    return {
      noticeList: [],
    }
  },
  onLoad() {
    this.getNoticeList()
  },
  onReady() {
  },
  /**
   * 用户点击右上角分享
   */
  // #ifdef MP
  onShareAppMessage: function () {
    let that = this;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    return {
      title: '',
      path: '/pages/index/index'
    };
  },
  onShareTimeline: function () {
    let that = this;
    return {
      title: '',
      query: {},
      imageUrl: ''
    };
  },
  // #endif
  methods: {
    getNoticeList() {
      this.noticeList = []
    },
  }
}
</script>

<style lang="scss" scoped>
.notice {
  margin-bottom: 20rpx;
}
</style>
