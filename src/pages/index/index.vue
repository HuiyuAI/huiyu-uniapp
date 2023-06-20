<template>
  <view class="content">
    <!-- 通知 -->
    <view class="notice">
      <rk-notice :show-icon="true" :show-more="false" :list="notice" @clickItem="clickItem"></rk-notice>
    </view>
    <!-- tabs -->
    <view id="tabs-rect" class="tabs-box">
      <rk-tabs :tabData="tabList" :defaultIndex="tabIdx" :config="tabsConfig" @tabClick='changeTab'/>
    </view>
    <!-- tab-item -->
    <pic-draw :scrollHeight="subsHeight" v-if="tabIdx == 0"></pic-draw>
  </view>

</template>

<script>
import picDraw from "./components/pic-draw.vue"

export default {
  components: {
    picDraw,
  },
  data() {
    return {
      notice: [
        '欢迎使用绘雨AI，如果您有任何建议，欢迎联系我们。',
      ],
      tabsConfig: {
        alignLeft: false,
        underLineColor: '#F8D849',
        activeColor: '#F8D849'
      },
      tabIdx: 0,
      tabList: [
        {
          name: "SD绘画",
          value: 0,
        },
        {
          name: "咒语解析",
          value: 1
        },
        {
          name: "以图生图",
          value: 2
        }
      ],
      subsHeight: 300,
    }
  },
  onReady() {
    let that = this;
    this.$utils.getRect('#tabs-rect').then(res => {
      let w_h = uni.getSystemInfoSync().windowHeight;
      that.subsHeight = w_h - res.top - res.height;
    });
  },
  onLoad() {
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
    clickItem(item) {
      if (item.url) {
        uni.navigateTo({
          url: '/pages/webview/webview?url=' + item.url,
        })
      }
    },
    changeTab(idx, item) {
      this.tabIdx = idx;
    },
  }
}
</script>

<style lang="scss">
.content {
}

.notice {
  margin-bottom: 20rpx;
}
</style>
