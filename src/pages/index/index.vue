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
import {shareAppImageUrlList} from '@/config'

export default {
  components: {Draw},
  data() {
    return {
      noticeList: [],
    }
  },
  onLoad(option) {
    this.saveBindInviterId(option.inviterId)
    this.getNoticeList()
  },
  onReady() {
  },
  // #ifdef MP
  onShareAppMessage: function () {
    const imageUrl = shareAppImageUrlList[this.$u.random(0, shareAppImageUrlList.length - 1)]

    const userId = this.$store.state.app.userId
    const query = userId ? `?inviterId=${userId}` : ''

    return {
      title: '绘语AI免费使用啦，快来试试吧~',
      path: `/pages/index/index${query}`,
      // TODO 显示图片长宽比是 5:4
      imageUrl: imageUrl,
    };
  },
  // #endif
  methods: {
    getNoticeList() {
      this.noticeList = []
    },
    saveBindInviterId(inviterId) {
      if (!inviterId) return
      if (this.$store.state.app.userId) return
      if (uni.getStorageSync('inviterId')) return
      uni.setStorageSync('inviterId', inviterId)
    },
  }
}
</script>

<style lang="scss" scoped>
.notice {
  margin-bottom: 20rpx;
}
</style>
