<template>
  <view class="record-wrapper">
    <view :class="['record-content', list.length == 0 ? 'empty' : '']">
      <view :class="['record-content__item', item.operationType === 'ADD' ? 'add' : 'reduce']" v-for="(item,index) in list" :key="index">
        <view class="record-content__item-left">
          <view>{{ getOperationSourceDesc(item.operationSource) }}</view>
          <view class="record-content__item-date">{{ item.createTime | date('yyyy-mm-dd hh:MM:ss') }}</view>
        </view>
        <view class="record-content__item-right">{{ item.operationType === 'ADD' ? `+${item.num}` : `-${item.num}` }}</view>
      </view>

      <u-empty v-if="!isLoading && list.length == 0" text="记录为空" icon-size="50"></u-empty>

      <u-divider v-if="isLastPage" bg-color="transparent" color="#555555" border-color="#555555" half-width="20%" margin-top="20">没有更多了</u-divider>
    </view>
  </view>
</template>

<script>
import {pagePointRecord} from "@/api/user";
import {getPointOperationSourceEnum} from "@/api/enum";

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 20,
      isLoading: false,
      isLastPage: false,
      pointOperationSourceEnumList: [],
      list: [],
    }
  },
  computed: {
    getOperationSourceDesc() {
      return (operationSource) => {
        return this.pointOperationSourceEnumList.find(item => item.key === operationSource).desc
      }
    }
  },
  onLoad() {
    this.getData()
  },
  onReachBottom() {
    this.getPagePointRecord()
  },
  methods: {
    getData() {
      this.isLoading = true
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
      getPointOperationSourceEnum().then(res => {
        this.pointOperationSourceEnumList = res
        this.getPagePointRecord()
      })
    },
    getPagePointRecord() {
      if (this.isLastPage) return
      pagePointRecord(this.pageNum++, this.pageSize).then(res => {
        this.list = this.list.concat(res.records)
        this.isLoading = false
        uni.hideLoading()

        // 到了最后一页
        if (res.records.length < this.pageSize) {
          this.isLastPage = true
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.record {
  &-wrapper {
    padding: 20rpx 40rpx;
  }

  &-content {
    padding: 0 20rpx 20rpx;
    border-radius: 20rpx;
    background: #1a1a1a;

    &.empty {
      min-height: 180rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #aaa;
      font-size: 28rpx;

      &.add {
        .record-content__item-right {
          color: #409EFF;
        }
      }

      &.reduce {
        .record-content__item-right {
          color: #67C23A;
        }
      }

      &-left {
        margin-left: 20rpx;
        font-size: 28rpx;
      }

      &-right {
        margin-right: 20rpx;
        font-size: 32rpx;
      }

      &-date {
        padding-top: 16rpx;
        font-size: 24rpx;
      }
    }
  }
}
</style>
