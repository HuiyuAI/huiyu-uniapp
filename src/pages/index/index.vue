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
import {bindInviter} from "@/api/user";

export default {
  components: {Draw},
  data() {
    return {
      noticeList: [],
    }
  },
  onLoad(option) {
    const sharerUserId = option.sharerUserId
    if (sharerUserId) {
      this.autoBindInviter(sharerUserId)
    }
    this.getNoticeList()
  },
  onReady() {
  },
  // #ifdef MP
  onShareAppMessage: function () {
    const imageUrl = shareAppImageUrlList[this.$u.random(0, shareAppImageUrlList.length - 1)]
    console.log(imageUrl)

    const userId = this.$store.state.userId
    const query = userId ? `?sharerUserId=${userId}` : ''

    return {
      title: '绘语AI免费使用啦，快来试试吧~',
      path: `/pages/index/index${query}`,
      // 分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4
      imageUrl: imageUrl,
    };
  },
  // #endif
  methods: {
    getNoticeList() {
      this.noticeList = []
    },
    autoBindInviter(sharerUserId) {
      console.log('autoBindInviter', sharerUserId)
      bindInviter(sharerUserId).then(res => {
        console.log('bindInviter', res)
      }).catch(e => {
        console.log(e)
      })

    },
  }
}
</script>

<style lang="scss" scoped>
.notice {
  margin-bottom: 20rpx;
}
</style>
