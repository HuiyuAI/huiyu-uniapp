<template>
    <view :class="['user-center-card', className]">
        <view class="user-center-card__title">{{title}}</view>
        <view class="user-center-card__content">
            <view class="user-center-card__item" @click="onClick(item)"  v-for="(item,index) in columns" :key="index">
                <text :class="['iconfont', item.icon]"/>
                <text>{{item.name}}</text>
            </view>
        </view>
    </view>
</template>

<script>

export default {
    props: {
        title: String,
        columns: Array,
        className: String,
    },
    methods: {
        onClick(index){
            uni.navigateTo({ url: '/pages/me/record/index'})
        },
    }
}
</script>

<style scoped lang="scss">
.user-center{
  &-card{
    padding: 10px;
    background: rgba($color: #333333, $alpha: 0.7);
    border-radius: 10px;
    &__content{
      display: flex;
      flex-wrap: wrap;
    }
    &__title{
      padding-bottom: 4px;
      font-size: 17px;
      font-weight: bold;
    }
    &__item{
      display: flex;
      width: 25%;
      flex-direction: column;
      align-items: center;
      padding: 5px 4px;
      font-size: 14px;
      .iconfont{
        margin-bottom: 8px;
        font-size: 24px;
      }
    }
  }
}
</style>