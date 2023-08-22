<template>
  <view class="container">
    <view class="user-box" @click="$u.throttle(getUserProfile, 1000)">
      <view class="u-flex">
        <view class="u-m-r-20">
          <image :src="userInfo.avatar" class="user-avatar" mode="aspectFill"></image>
        </view>
        <view class="u-flex-1">
          <view class="user-nickname u-p-b-10">
            {{ userInfo.nickname }}
          </view>
          <view class="user-id u-tips-color">ID: {{ userInfo.userId }}</view>
        </view>

        <view class="u-m-r-10">
          <u-icon name="setting" color="#969799" size="28"></u-icon>
        </view>
        <view>
          <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
        </view>
      </view>
    </view>

    <view class="point-box">
      <view class="daily-point">
        <view class="title">
          <span>每日赠送</span>
          <u-icon name="question-circle" @click="tipsPoint(1)"></u-icon>
        </view>
        <view class="value">
          <view class="t-icon t-icon-point"></view>
          <span>{{ userInfo.dailyPoint }}</span>
        </view>
      </view>

      <view class="point">
        <view class="title">
          <span>永久积分</span>
          <u-icon name="question-circle" @click="tipsPoint(2)"></u-icon>
        </view>
        <view class="value">
          <view class="t-icon t-icon-point"></view>
          <span>{{ userInfo.point }}</span>
        </view>
      </view>
    </view>

    <view class="grid-box">
      <Card :columns="commonColumns"/>
    </view>

    <view class="daily-task-title">
      每日任务
    </view>

    <view class="task-wrapper">
      <view class="task-content">
        <view class="task-content__item" v-for="(item,index) in dailyTaskList" :key="index">
          <view :class="['task-content__item-left', item.desc ? '' : 'no-desc']">
            <view>{{ item.title }}</view>
            <view class="desc">{{ item.desc }}</view>
          </view>
          <view class="task-content__item-point">
            <view class="t-icon t-icon-point"></view>
            <span>{{ `+${item.point}` }}</span>
          </view>
          <view class="task-content__item-right finished" v-if="item.status">{{ item.action }}</view>
          <view class="task-content__item-right unfinished" v-else @click="toTab(item)">{{ item.action }}</view>
        </view>
      </view>
    </view>

    <u-top-tips ref="uTips"></u-top-tips>
    <u-modal v-model="tipsPointModelShow" confirm-text="确定" title="积分说明" :content="tipsPointModelContent"></u-modal>
  </view>
</template>

<script>
import {login} from "@/api/login";
import {getMyUserInfo} from "@/api/user";
import {parseJwtPayload2Obj} from "@/util/jwtUtils";
import Card from "./components/card.vue"
import {dailyPointGive} from "@/config";

export default {
  components: {Card},
  data() {
    return {
      userInfo: {
        userId: 0,
        nickname: '未登录',
        avatar: '/static/images/logout_avatar.jpg',
        dailyPoint: 0,
        point: 0,
      },
      commonColumns: [
        {name: '积分记录', icon: 'icon-ic_batch_default24px', page: '/pages/record/index'},
        {name: '邀请好友', icon: 'icon-fenxiang'},
        {name: '邀请好友', icon: 'icon-fenxiang'},
        {name: '邀请好友', icon: 'icon-fenxiang'},
      ],
      dailyTaskList: [
        {title: '每日登录', desc: '进度(0/1)', point: `${dailyPointGive} (当日过期)`, status: true, action: '已完成', page: ''},
        {title: '邀请好友', desc: '', point: '200', status: false, action: '去邀请', page: ''},
        {title: '投稿作品', desc: '进度(0/3)', point: '30', status: false, action: '去投稿', page: '/pages/pic/index'},
        {title: '完成创作', desc: '进度(0/5)', point: '10', status: false, action: '去创作', page: '/pages/index/index'},
      ],
      tipsPointModelShow: false,
      tipsPointModelContent: '',
    }
  },
  onLoad() {
    if (!this.isLogin()) {
      return
    }
    this.checkUserInfo()
  },
  onShow() {
    if (!this.isLogin()) {
      this.initLogoutUserInfo()
      return
    }
    this.getMyUserInfo()
  },
  methods: {
    isLogin() {
      const userInfo = uni.getStorageSync('userInfo')
      return userInfo ? true : false
    },
    checkUserInfo() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = userInfo
      } else {
        this.initLogoutUserInfo()
      }
    },
    initLogoutUserInfo() {
      this.userInfo = {
        userId: 0,
        nickname: '未登录',
        avatar: '/static/images/logout_avatar.jpg',
        dailyPoint: 0,
        point: 0,
      }
    },
    getUserProfile() {
      if (this.userInfo.userId !== 0) {
        return
      }
      // 获取用户信息
      uni.getUserProfile({
        desc: '需要获取权限',
        success: async (res) => {
          let data = {
            iv: res.iv,
            encryptedData: res.encryptedData,
          }

          // 获取code
          data.code = await new Promise((resolve, reject) => {
            uni.login({
              provider: 'weixin',
              success: (loginRes) => {
                resolve(loginRes.code)
              },
              fail: (err) => {
                reject(err)
              }
            })
          })

          // 保存用户信息和token
          login(data).then(res => {
            uni.setStorageSync('access_token', res.access_token)
            uni.setStorageSync('refresh_token', res.refresh_token)
            // access_token到期时间
            uni.setStorageSync('access_token_expires_at', ~~(Date.now() / 1000) + res.expires_in)
            // refresh_token到期时间
            const refreshTokenPayload = parseJwtPayload2Obj(res.refresh_token)
            uni.setStorageSync('refresh_token_expires_at', refreshTokenPayload.exp)
            this.getMyUserInfo()
          })
        },
        fail: () => {
          this.$refs.uTips.show({
            title: '需要获取权限才能继续',
            type: 'warning'
          })
        }
      })
    },
    getMyUserInfo() {
      getMyUserInfo().then(res => {
        this.userInfo = res
        uni.setStorageSync('userInfo', this.userInfo)
      })
    },
    tipsPoint(index) {
      if (index === 1) {
        this.tipsPointModelContent = `每日赠送：每天0点自动补充至${dailyPointGive}，当天24点过期`
      } else if (index === 2) {
        this.tipsPointModelContent = '永久积分：无过期时间，永久可用'
      }
      this.tipsPointModelShow = true
    },
    toTab(item) {
      if (item.page) {
        uni.switchTab({
          url: item.page
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 20rpx 20rpx;
}

.user-box {
  display: flex;
  flex-direction: column;
  margin: 0 20rpx;

  .user-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }

  .user-nickname {
    font-size: 32rpx;
  }

  .user-id {
    font-size: 24rpx;
  }
}

.point-box {
  margin: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .daily-point, .point {
    width: calc(50% - 10rpx);
    background-color: #1a1a1a;
    padding: 20rpx;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    .title {
      font-size: 28rpx;
      margin-bottom: 10rpx;

      span {
        margin-right: 6rpx;
      }
    }

    .value {
      display: flex;
      align-items: center;

      .t-icon {
        width: 28rpx;
        height: 28rpx;
        margin-right: 6rpx;
      }

      span {
        font-weight: bold;
        color: #ff6600;
      }
    }
  }
}

.grid-box {
  margin-top: 20rpx;
}

.daily-task-title {
  margin: 40rpx 20rpx 0 30rpx;
  font-size: 32rpx;
}

.task {
  &-wrapper {
    margin: 20rpx 20rpx 0;
  }

  &-content {
    padding: 0 20rpx;
    border-radius: 10rpx;
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
      border-bottom: 1rpx solid #aaa;
      font-size: 28rpx;
      height: 110rpx;

      &:last-child {
        border-bottom: none;
      }

      &-left {
        margin-left: 20rpx;
        font-size: 28rpx;

        .desc {
          padding-top: 4rpx;
          font-size: 20rpx;
          color: #888;
        }

        &.no-desc {
          display: flex;
          align-items: center;
        }
      }

      &-point {
        display: flex;
        align-items: center;
        margin-left: 20rpx;
        margin-right: auto;
        font-size: 24rpx;

        .t-icon {
          width: 28rpx;
          height: 28rpx;
          margin-right: 4rpx;
        }
      }

      &-right {
        margin-right: 20rpx;
        font-size: 24rpx;
        padding: 10rpx 20rpx;
        border: 1rpx solid $huiyu-color-main;
        border-radius: 10rpx;

        &.finished {
          color: $huiyu-color-main;
        }

        &.unfinished {
          color: black;
          background: $huiyu-color-button;
        }
      }
    }
  }
}
</style>
