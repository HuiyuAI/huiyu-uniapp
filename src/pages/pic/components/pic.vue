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

    <uv-waterfall ref="waterfall" v-model="list" addTime="0" columnCount="3" column-gap="6" @changeList="changeList">
      <!-- 第一列数据 -->
      <template v-slot:list1>
        <view>
          <view v-for="(item, index) in list1" :key="item.id" class="img-box">
            <view>
              <zero-lazy-load :image="item.image" threshold="500" duration="500" borderRadius="12"></zero-lazy-load>
            </view>
          </view>
        </view>
      </template>
      <!-- 第二列数据 -->
      <template v-slot:list2>
        <view>
          <view v-for="(item, index) in list2" :key="item.id" class="img-box">
            <view>
              <zero-lazy-load :image="item.image" threshold="500" duration="500" borderRadius="12"></zero-lazy-load>
            </view>
          </view>
        </view>
      </template>
      <!-- 第三列数据 -->
      <template v-slot:list3>
        <view>
          <view v-for="(item, index) in list3" :key="item.id" class="img-box">
            <view>
              <zero-lazy-load :image="item.image" threshold="500" duration="500" borderRadius="12"></zero-lazy-load>
            </view>
          </view>
        </view>
      </template>
    </uv-waterfall>

  </view>
</template>

<script>
import {getPicPage} from "@/api/pic";
import ZeroLazyLoad from "@/components/zero-lazy-load/zero-lazy-load.vue";

export default {
  name: "pic",
  components: {ZeroLazyLoad},
  data() {
    return {
      totalCount: 0,
      list: [],
      list1: [],
      list2: [],
      list3: []
    }
  },
  mounted() {
    this.getPicPage()
  },
  onPullDownRefresh() {
  },
  methods: {
    changeList(e) {
      this[e.name].push(e.value)
    },
    getPicPage() {
      // TODO 分页
      getPicPage(1, 300, Date.now()).then(res => {
        this.totalCount = res.total
        res.records.forEach(item => {
          const img = {
            id: item.uuid,
            image: item.path
          }
          this.list.push(img)
        })
      })
    },
    batchAction() {

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
    font-size: 12px;
  }

  .right {
    display: flex;
    font-size: 14px;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;

      .iconfont {
        font-size: 16px;
        margin-right: 4rpx;
      }
    }
  }
}

.img-box {
  margin-bottom: 12rpx;
}
</style>
