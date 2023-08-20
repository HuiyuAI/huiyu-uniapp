<template>
  <view class="container">
    <uv-waterfall ref="waterfall" v-model="list" addTime="0" columnCount="2" column-gap="6" @changeList="changeList" @finish="finish">
      <!-- 第一列数据 -->
      <template v-slot:list1>
        <view>
          <view v-for="(item, index) in list1" :key="item.id" class="img-box">
            <view @click="toDetailPage(item)">
              <zero-lazy-load :image="item.image" threshold="500" duration="500" borderRadius="12rpx 12rpx 0 0"></zero-lazy-load>
              <view class="img-box__footer">
                <view class="title" v-if="item.title">{{ item.title }}</view>
                <view class="info">
                  <view class="left">
                    <image :src="item.userAvatar" class="avatar" mode="aspectFill"></image>
                    <view class="nickname">{{ item.userNickname }}</view>
                  </view>
                  <view class="right">
                    <u-icon class="icon" :name="false ? 'heart-fill' : 'heart'" :style="{color: false ? '#F56C6C' : ''}"></u-icon>
                    <view class="u-line-1">{{ item.likeCount }}</view>
                  </view>
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
              <zero-lazy-load :image="item.image" threshold="500" duration="500" borderRadius="12rpx 12rpx 0 0"></zero-lazy-load>
              <view class="img-box__footer">
                <view class="title" v-if="item.title">{{ item.title }}</view>
                <view class="info">
                  <view class="left">
                    <image :src="item.userAvatar" class="avatar" mode="aspectFill"></image>
                    <view class="nickname">{{ item.userNickname }}</view>
                  </view>
                  <view class="right">
                    <u-icon class="icon" :name="false ? 'heart-fill' : 'heart'" :style="{color: false ? '#F56C6C' : ''}"></u-icon>
                    <view class="u-line-1">{{ item.likeCount }}</view>
                  </view>
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
import {getPicSharePage} from "@/api/pic";

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
      scrollTop: 0,
    }
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
      getPicSharePage(this.pageNum++, this.pageSize, this.queryDeadline).then(res => {
        if (isFirst) {
          this.totalCount = res.total
          this.list = []
          this.$refs.waterfall.clear()
          this.list1 = []
          this.list2 = []
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
            originWidth: item.width,
            originHeight: item.height,
            title: item.title,
            userAvatar: item.userAvatar,
            userNickname: item.userNickname,
            likeCount: item.likeCount,
          }
        })
        this.$nextTick(() => {
          this.list = this.list.concat(processedList)
        })
      })
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
  background-color: #1a1a1a;
  border-radius: 12rpx;

  &__footer {
    display: flex;
    flex-direction: column;
    padding: 20rpx 16rpx;

    .title {
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }

    .info {
      display: flex;

      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
        }

        .nickname {
          margin-left: 8rpx;
          font-size: 24rpx;
          color: #969696;
        }
      }

      .right {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 24rpx;
        color: #969696;

        .icon {
          font-size: 34rpx;
          margin-right: 8rpx;
        }
      }
    }
  }
}

.safe-area {
  padding-bottom: 2rpx;
}
</style>
