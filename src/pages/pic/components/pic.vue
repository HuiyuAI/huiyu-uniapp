<template>
  <view class="container">
    <view class="header">
      <view class="action-box">
        <view class="left">作品数量: {{ totalCount }} / 1000</view>
        <view class="right">
          <view class="item" @click="clickBatchAction">
            <view v-if="!showBatchSelect">
              <text class="iconfont icon-ic_batch_default24px"></text>
              {{ batchActionText }}
            </view>
            <view v-else class="batch-cancel">取消</view>
          </view>
        </view>
      </view>
    </view>

    <view class="main">
      <scroll-view class="scroll" scroll-y enable-back-to-top show-scrollbar refresher-default-style="white"
                   :scroll-top="scrollTop" @scroll="onScroll" scroll-with-animation
                   refresher-enabled :refresher-triggered="refreshTriggered" @refresherrefresh="onRefresh"
                   lower-threshold="50" @scrolltolower="reachBottom">
        <uv-waterfall ref="waterfall" v-model="list" addTime="0" columnCount="3" column-gap="6" @changeList="changeList" @finish="finish" @remove="remove">
          <!-- 第一列数据 -->
          <template v-slot:list1>
            <view>
              <view v-for="(item, index) in list1" :key="item.id" class="img-box">
                <text :class="['check-box', 'iconfont', item.checked ? 'icon-squarecheck' : 'icon-square']" v-show="showBatchSelect" @click="clickCheckBox(item)"></text>
                <text class="quality-4k iconfont icon-k-line" v-show="item.is4k"></text>
                <view @click="toDetailPage(item)">
                  <view :class="item.checked ? 'image-checked': ''"></view>
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
                <text :class="['check-box', 'iconfont', item.checked ? 'icon-squarecheck' : 'icon-square']" v-show="showBatchSelect" @click="clickCheckBox(item)"></text>
                <text class="quality-4k iconfont icon-k-line" v-show="item.is4k"></text>
                <view @click="toDetailPage(item)">
                  <view :class="item.checked ? 'image-checked': ''"></view>
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
                <text :class="['check-box', 'iconfont', item.checked ? 'icon-squarecheck' : 'icon-square']" v-show="showBatchSelect" @click="clickCheckBox(item)"></text>
                <text class="quality-4k iconfont icon-k-line" v-show="item.is4k"></text>
                <view @click="toDetailPage(item)">
                  <view :class="item.checked ? 'image-checked': ''"></view>
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

        <u-divider v-if="isLastPage && waterfallFinish" bg-color="transparent" color="#555555" border-color="#555555" half-width="20%" margin-top="20">没有更多了</u-divider>

        <view class="safe-area" v-if="!showBatchSelect"></view>
      </scroll-view>
    </view>

    <view class="footer" v-if="showBatchSelect">
      <view class="left">
        <view>已选中 {{ selectedArr.length }} 张</view>
      </view>
      <view class="right">
        <view class="item delete" @click="batchDelete">
          <text class="iconfont icon-delete"></text>
          <view class="u-line-1">删除</view>
        </view>
      </view>
    </view>

    <u-back-top :scroll-top="oldScrollTop" top="2000" duration="500" bottom="140" right="30" :icon-style="{fontSize: '40rpx',color:'#759ef0'}" @click.native.prevent="goTop"></u-back-top>

    <u-modal v-model="deleteConfirmModalShow" @confirm="confirmDelete" title="删除" confirm-text="确定" :content="`确定要删除这${this.selectedArr.length}张图片吗？`" show-cancel-button></u-modal>
  </view>
</template>

<script>
import {getPicPage, deleteByUuidList} from "@/api/pic";

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
      oldScrollTop: 0,
      batchActionText: '批量',
      showBatchSelect: false,
      selectedArr: [],
      deleteConfirmModalShow: false,
      refreshTriggered: false,
      refreshing: false,
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
    onScroll(e) {
      this.oldScrollTop = e.detail.scrollTop
    },
    goTop() {
      this.scrollTop = this.oldScrollTop
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    onRefresh() {
      if (this.refreshing) return
      this.refreshing = true

      if (!this.refreshTriggered) {
        this.refreshTriggered = true
      }

      this.refreshData()
    },
    restoreRefresh() {
      setTimeout(() => {
        this.refreshTriggered = false
        this.refreshing = false
      }, 500)
    },
    refreshData() {
      this.pageNum = 1
      this.isLastPage = false
      this.getPicPage(true, true)
      this.selectedArr = []
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
          this.restoreRefresh()
        }

        const processedList = res.records.map(item => {
          return {
            id: item.uuid,
            image: item.path,
            status: item.status,
            originWidth: item.width,
            originHeight: item.height,
            is4k: item.is4k,
            checked: false,
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
    clickBatchAction() {
      if (this.showBatchSelect) {
        this.showBatchSelect = false
        this.batchActionText = '批量'
        // 重置选中状态
        this.list1.forEach(item => {
          item.checked = false
        })
        this.list2.forEach(item => {
          item.checked = false
        })
        this.list3.forEach(item => {
          item.checked = false
        })
        this.selectedArr = []
      } else {
        this.showBatchSelect = true
        this.batchActionText = '取消'
      }
    },
    clickCheckBox(item) {
      if (item.checked) {
        // 从选中数组中删除
        const index = this.selectedArr.findIndex(id => id === item.id)
        index !== -1 && this.selectedArr.splice(index, 1)
      } else {
        // 添加到选中数组中
        this.selectedArr.push(item.id)
      }
      item.checked = !item.checked
    },
    batchDelete() {
      if (this.selectedArr.length === 0) {
        uni.showToast({
          title: '请选择要删除的图片',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      this.deleteConfirmModalShow = true
    },
    confirmDelete() {
      uni.showLoading({
        title: '正在删除中...',
        mask: true
      });

      deleteByUuidList(this.selectedArr).then(res => {
        uni.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })
        this.selectedArr.forEach(id => {
          this.$refs.waterfall.remove(id)
        })
        this.totalCount -= this.selectedArr.length
        this.selectedArr = []
      }).finally(() => {
        uni.hideLoading()
      })
    },
    // 删除某项后返回对应id，根据id标识在列数据中手动删除该项数据
    remove(id) {
      const index1 = this.list1.findIndex(item => item.id === id)
      if (index1 !== -1) {
        this.list1.splice(index1, 1)
        return
      }

      const index2 = this.list2.findIndex(item => item.id === id)
      if (index2 !== -1) {
        this.list2.splice(index2, 1)
        return
      }

      const index3 = this.list3.findIndex(item => item.id === id)
      if (index3 !== -1) {
        this.list3.splice(index3, 1)
        return
      }
    },
    toDetailPage(item) {
      const query = this.$u.queryParams(item)
      uni.navigateTo({
        url: `/pages/detail/index${query}`,
        events: {
          // 监听图片在子页面中生成完毕的事件
          onImageGenerated: (data) => {
            const {uuid, image} = data
            console.log('onImageGenerated', data)
            const index1 = this.list1.findIndex(item => item.id === uuid)
            if (index1 !== -1) {
              this.list1[index1].image = image
              this.list1[index1].status = 'GENERATED'
              console.log(this.list1[index1])
              return
            }

            const index2 = this.list2.findIndex(item => item.id === uuid)
            if (index2 !== -1) {
              this.list2[index2].image = image
              this.list2[index2].status = 'GENERATED'
              return
            }

            const index3 = this.list3.findIndex(item => item.id === uuid)
            if (index3 !== -1) {
              this.list3[index3].image = image
              this.list3[index3].status = 'GENERATED'
              return
            }
          },
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 0rpx 12rpx;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.action-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12rpx 6rpx;
  height: 80rpx;

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

      .batch-cancel {
        font-size: 24rpx;
        padding: 4rpx 20rpx;
        border: 1rpx solid;
        border-radius: 10rpx;
      }
    }
  }
}

.main {
  flex: 1;
  overflow-y: auto;

  .scroll {
    height: 100%;
  }
}

.img-box {
  margin-bottom: 12rpx;
  position: relative;

  .check-box {
    position: absolute;
    top: 0;
    left: 0;
    padding: 12rpx;
    z-index: 1;
    font-size: 50rpx;
  }

  .quality-4k {
    position: absolute;
    top: 0;
    right: 0;
    padding: 12rpx;
    z-index: 1;
  }

  .image-checked {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }

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

.footer {
  height: 90rpx;
  padding-top: 14rpx;
  padding-bottom: 14rpx;
  display: flex;

  .left {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    margin-left: 20rpx;
  }

  .right {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    margin-left: auto;
    margin-right: 20rpx;

    .item {
      display: flex;
      align-items: center;
      margin: 0 12rpx;
      padding: 12rpx 14rpx;
      border: 1rpx solid;
      border-radius: 10rpx;

      .iconfont {
        margin-right: 4rpx;
      }

      &:last-child {
        margin-right: 0rpx;
      }

      &.delete {
        color: #F56C6C;
      }
    }
  }
}

.safe-area {
  padding-bottom: 90rpx;
}
</style>
