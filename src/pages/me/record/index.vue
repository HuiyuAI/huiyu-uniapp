<template>
    <view class="record-wrapper">
        <view class="record-title">{{title}}</view>
        <view class="record-content">
            <view :class="['record-content__item', item.num >= 0 ? 'increase' : 'decline']" v-for="(item,index) in list" :key="index">
                <view class="record-content__item-left">
                    <view>{{item.num >= 0 ? '增加' : '消耗'}}</view>
                    <view class="record-content__item-date">{{item.date}}</view>
                </view>
              
                <view class="record-content__item-right">{{item.num >= 0 ? `+${item.num}` : item.num}}</view>

            </view>
            <view v-if="list.length<=0" class="empty">
                暂无数据
            </view>
        </view>
    </view>
</template>

<script>

export default {
    data() {
        return {
            list: [{ num: 20, date: '2022-02-11', }, { num: -20, date: '2022-02-10', }, { num: 30, date: '2022-02-09', },],
            // list: []
        }
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
.record{
    &-wrapper{
        padding: 20px;
        .empty{
            text-align: center;
        }
    }
    &-content{
        padding: 20px 10px;
        min-height: 400px;
        border-radius: 10px;
        background: rgba($color: #333333, $alpha: 0.7);
        &__item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 0.5px solid #fff;
            font-size: 14px;
            &:nth-last-of-type(1){
                border: none;
            }
            &.increase{
                 .record-content__item-right{
                    color: #ed5736;
                }
            }
            &.decline{
                .record-content__item-right{
                    color: #7FFFD4;
                }
            }
            &-left{
                font-size: 18px;
            }
            &-right{
                font-size: 16px;
            }
            &-date{
                padding-top: 8px;
                font-size: 12px;
            }
        }
    }
  
}
</style>