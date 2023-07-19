<template>
  <view class="container">
    <view class="user-box" @click="$u.throttle(getUserProfile, 1000)">
      <view class="u-flex">
        <view class="u-m-r-20">
          <u-avatar :src="userInfo.avatar" size="100"></u-avatar>
        </view>
        <view class="u-flex-1">
          <view class="user-nickname u-p-b-10">
            {{ userInfo.nickname }}
          </view>
          <view class="user-id u-tips-color">ID: {{ userInfo.userId }}</view>
        </view>
      </view>
    </view>

    <view class="point">
      积分：{{ userInfo.point }}
    </view>

    <view class="grid-box">
      <Card :columns="commonColumns"/>
    </view>

    <u-top-tips ref="uTips"></u-top-tips>
    <u-toast ref="uToast"/>
  </view>
</template>

<script>
import {login} from "@/api/login";
import {getMyUserInfo} from "@/api/user";
import {parseJwtPayload2Obj} from "@/util/jwtUtils";
import Card from "./components/card.vue"

export default {
  components: {Card,},
  data() {
    return {
      userInfo: {
        userId: 0,
        nickname: '未登录',
        avatar: '/static/images/logout_avatar.jpg',
        point: 0,
      },
      commonColumns: [
        {name: '积分记录', icon: 'icon-ic_batch_default24px', page: '/pages/record/index'},
        {name: '邀请好友', icon: 'icon-appreciate_light'},
        {name: '邀请好友', icon: 'icon-fenxiang'},
        {name: '邀请好友', icon: 'icon-fenxiang'},
      ]
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
        this.userInfo = {
          userId: 0,
          nickname: '未登录',
          avatar: '/static/images/logout_avatar.jpg',
          point: 0,
        }
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
    }
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
  padding: 0 20rpx 0 20rpx;

  .user-nickname {
    font-size: 32rpx;
  }

  .user-id {
    font-size: 24rpx;
  }
}

.point {
  margin: 20rpx;
}

.grid-box {
  margin-top: 20rpx;
}
</style>
