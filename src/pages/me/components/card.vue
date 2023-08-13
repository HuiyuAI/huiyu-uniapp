<template>
  <view class="user-center-card">
    <view class="user-center-card__content">
      <view class="user-center-card__item" @click="clickItem(item)" v-for="(item,index) in columns" :key="index">
        <text :class="['iconfont', item.icon]"/>
        <text>{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    columns: Array,
  },
  methods: {
    clickItem(item) {
      if (item.page) {
        uni.navigateTo({
          url: item.page
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
.user-center {
  &-card {
    margin: 20rpx;
    padding: 20rpx;
    border-radius: 10rpx;
    background: #1a1a1a;

    &__content {
      display: flex;
      flex-wrap: wrap;
    }

    &__item {
      display: flex;
      width: 25%;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      margin-bottom: 20px;

      &:nth-last-child(-n+4) {
        margin-bottom: 0;
      }

      .iconfont {
        margin-bottom: 8rpx;
        font-size: 40rpx;
      }
    }
  }
}
</style>
