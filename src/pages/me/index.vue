<template>
  <view>
    <view class="user-box" @click="$u.debounce(getUserProfile, 1000,true)">
      <view class="u-flex">
        <view class="u-m-r-20">
          <u-avatar :src="userInfo.avatar" size="120"></u-avatar>
        </view>
        <view class="u-flex-1">
          <view class="u-font-18 u-p-b-20">
            {{ userInfo.username }}
            <u-icon name="man" color="#2979ff" size="28" v-if="userInfo.gender===0"></u-icon>
            <u-icon name="woman" color="#fd79a8" size="28" v-else-if="userInfo.gender===1"></u-icon>
            <u-tag text="学校管理员" type="primary" v-if="userInfo.role==='ROLE_ADMIN'" class="role-tag"/>
          </view>
          <view class="u-font-14 u-tips-color">ID: {{ userInfo.id }}</view>
        </view>
      </view>
    </view>

    <u-top-tips ref="uTips"></u-top-tips>
    <u-toast ref="uToast"/>
  </view>
</template>

<script>
import {login} from "@/api/login";
import {parseJwtPayload2Obj} from "@/util/jwtUtils";

export default {
  name: "Me",
  data() {
    return {
      userInfo: {
        id: 0,
        username: '未登录',
        avatar: '/static/images/logout_avatar.jpg',
        gender: 2,
        role: 'ROLE_USER'
      },
      scrollTop: 0,
    }
  },
  onLoad() {
    if (!this.isLogin()) {
      return
    }
    this.checkUserInfo()
  },
  onPullDownRefresh() {
    if (!this.isLogin()) {
      uni.stopPullDownRefresh()
      return
    }
    this.checkUserInfo()
    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 1000);
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  methods: {
    isLogin() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        return true
      }
      return false
    },
    checkUserInfo() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = userInfo
      } else {
        this.userInfo = {
          id: 0,
          username: '未登录',
          avatar: '/static/images/logout_avatar.jpg',
          gender: 2,
          role: 'ROLE_USER'
        }
      }
    },
    getUserProfile() {
      if (this.userInfo.id !== 0) {
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
            console.log(res)
            const userInfo = (
                ({id, openid, username, avatar, gender, role}) => ({id, openid, username, avatar, gender, role})
            )(res)
            uni.setStorageSync('userInfo', userInfo)
            uni.setStorageSync('access_token', res.access_token)
            uni.setStorageSync('refresh_token', res.refresh_token)
            // access_token到期时间
            uni.setStorageSync('access_token_expires_at', ~~(Date.now() / 1000) + res.expires_in)
            // refresh_token到期时间
            const refreshTokenPayload = parseJwtPayload2Obj(res.refresh_token)
            uni.setStorageSync('refresh_token_expires_at', refreshTokenPayload.exp)
            this.userInfo = userInfo
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
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
</style>

<style scoped lang="scss">
.user-box {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20rpx 20rpx 10rpx 30rpx;

  .role-tag {
    float: right;
    margin-right: 20rpx;
  }
}
</style>
