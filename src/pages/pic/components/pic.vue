<template>
  <view class="container">
    <!-- 高级设置 -->
    <view class="action-box">
      <view class="left">作品数量: {{ totalCount }} / 1000</view>
      <view class="right">
        <view class="item" @click="batchAction">
          <text class="iconfont icon-ic_batch_default24px"></text>
          批量
        </view>
      </view>
    </view>

    <uv-waterfall ref="waterfall" v-model="list" addTime="0" columnCount="3" column-gap="6" @changeList="changeList" @finish="finish">
      <!-- 第一列数据 -->
      <template v-slot:list1>
        <view>
          <view v-for="(item, index) in list1" :key="item.id" class="img-box">
            <view @click="toDetailPage(item)">
              <zero-lazy-load v-if="item.status === 'GENERATED'" :image="item.image" @error="imgLoadError(item)" threshold="500" duration="500" borderRadius="12"></zero-lazy-load>
              <view v-else class="img-status-box" :style="{paddingBottom: aspectRatio(item) + '%'}">
                <view class="img-status-text">
                  <view class="u-text-center" v-html="imgStatusText(item.status)"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <!-- 第二列数据 -->
      <template v-slot:list2>
        <view>
          <view v-for="(item, index) in list2" :key="item.id" class="img-box">
            <view @click="toDetailPage(item)">
              <zero-lazy-load v-if="item.status === 'GENERATED'" :image="item.image" @error="imgLoadError(item)" threshold="500" duration="500" borderRadius="12"></zero-lazy-load>
              <view v-else class="img-status-box" :style="{paddingBottom: aspectRatio(item) + '%'}">
                <view class="img-status-text">
                  <view class="u-text-center" v-html="imgStatusText(item.status)"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <!-- 第三列数据 -->
      <template v-slot:list3>
        <view>
          <view v-for="(item, index) in list3" :key="item.id" class="img-box">
            <view @click="toDetailPage(item)">
              <zero-lazy-load v-if="item.status === 'GENERATED'" :image="item.image" @error="imgLoadError(item)" threshold="500" duration="500" borderRadius="12"></zero-lazy-load>
              <view v-else class="img-status-box" :style="{paddingBottom: aspectRatio(item) + '%'}">
                <view class="img-status-text">
                  <view class="u-text-center" v-html="imgStatusText(item.status)"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </uv-waterfall>

    <u-divider v-if="isLastPage && waterfallFinish" bg-color="transparent" color="#555555" border-color="#555555" half-width="20%" margin-top="20" margin-bottom="20">没有更多了</u-divider>
    <view class="safe-area"></view>

    <u-back-top :scroll-top="scrollTop" top="1000" duration="500" bottom="50" right="30" :icon-style="{fontSize: '40rpx',color:'#759ef0'}"></u-back-top>
  </view>
</template>

<script>
import {getPicPage} from "@/api/pic";

export default {
  name: "pic",
  data() {
    return {
      pageNum: 1,
      pageSize: 100,
      queryDeadline: null,
      isLastPage: false,
      waterfallFinish: false,
      totalCount: 0,
      list: [],
      list1: [],
      list2: [],
      list3: [],
      scrollTop: 0,
    }
  },
  computed: {
    aspectRatio() {
      return function (item) {
        return (item.originHeight / item.originWidth) * 100
      }
    },
    imgStatusText() {
      return function (status) {
        switch (status) {
          case 'GENERATING':
            return '图片正在生成中'
          case 'DISCARD':
            return '图片生成失败<br>积分已返还您的账户'
          case 'RISKY':
            return '图片检测违规'
          default:
            return '图片加载失败'
        }
      }
    },
  },
  mounted() {
    this.getPicPage(true)
  },
  methods: {
    changeList(e) {
      this[e.name].push(e.value)
    },
    finish() {
      this.waterfallFinish = true
    },
    pullDownRefresh() {
      this.pageNum = 1
      this.isLastPage = false
      this.getPicPage(true, true)
    },
    reachBottom() {
      this.getPicPage()
    },
    getPicPage(isFirst, isRefresh) {
      if (this.isLastPage) return
      this.waterfallFinish = false
      if (isFirst) {
        this.queryDeadline = Date.now()
      }
      getPicPage(this.pageNum++, this.pageSize, this.queryDeadline).then(res => {
        if (isFirst) {
          this.totalCount = res.total
          this.list = []
          this.$refs.waterfall.clear()
          this.list1 = []
          this.list2 = []
          this.list3 = []
        }
        // 到了最后一页
        if (res.records.length < this.pageSize) {
          this.isLastPage = true
          if (res.records.length === 0) {
            // 如果一条数据都没有，瀑布流组件不会触发finish事件，所以这里手动触发一下，让底部的没有更多了显示出来
            this.waterfallFinish = true
          }
        }
        if (isRefresh) {
          setTimeout(() => {
            uni.stopPullDownRefresh()
          }, 500);
        }

        const processedList = res.records.map(item => {
          return {
            id: item.uuid,
            image: item.path,
            status: item.status,
            originWidth: item.width,
            originHeight: item.height,
          }
        })
        this.$nextTick(() => {
          this.list = this.list.concat(processedList)
        })
      })
    },
    imgLoadError(item) {
      item.status = 'ERROR'
    },
    batchAction() {

    },
    toDetailPage(item) {
      const query = this.$u.queryParams(item)
      uni.navigateTo({
        url: `/pages/detail/index${query}`,
      })
    },
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 0rpx 12rpx;
}

.action-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx 10rpx 20rpx;

  .left {
    font-size: 24rpx;
  }

  .right {
    display: flex;
    font-size: 28rpx;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;

      .iconfont {
        font-size: 32rpx;
        margin-right: 4rpx;
      }
    }
  }
}

.img-box {
  margin-bottom: 12rpx;

  .img-status-box {
    position: relative;
    background-color: #1a1a1a;
    width: 100%;
    border-radius: 12rpx;

    .img-status-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 22rpx;
      color: #969696;
    }
  }
}

.safe-area {
  padding-bottom: 2rpx;
}
</style>
