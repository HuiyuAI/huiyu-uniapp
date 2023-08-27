<template>
  <view>
    <view class="avatar-box">
      <image :src="userInfo.avatar" class="user-avatar" mode="aspectFill" @click="chooseAvatar"></image>
    </view>
    <view class="desc-box">
      <view class="title">
        <text class="text">7天内最多可修改5次头像和昵称</text>
      </view>
      <view class="content">

        <view class="content__item">
          <view class="content__item-left">
            <view>昵称</view>
          </view>
          <view class="content__item-right" @click="nicknameModalShow=true">
            <view class="value">{{ userInfo.nickname }}</view>
            <u-icon name="edit-pen" color="#aaa"></u-icon>
          </view>
        </view>

        <view class="content__item">
          <view class="content__item-left">
            <view>用户ID</view>
          </view>
          <view class="content__item-right">
            <view class="value">{{ userInfo.userId }}</view>
          </view>
        </view>

      </view>
    </view>

    <view class="logout-box">
      <view class="content" @click="logoutModalShow=true">退出登录</view>
    </view>

    <u-modal v-model="nicknameModalShow" @confirm="updateNickname" async-close title="修改昵称" confirm-text="确定" show-cancel-button negative-top="500rpx">
      <view class="nickname-modal-slot">
        <view class="input">
          <input v-model="newNickname" type="text" maxlength="8" placeholder="请输入昵称" :adjust-position="true"/>
        </view>
        <view class="tips">{{ newNickname.length }}/{{ nicknameMaxInput }}</view>
      </view>
    </u-modal>
    <u-modal v-model="logoutModalShow" @confirm="logout" title="退出登录" confirm-text="退出" content="确定要退出登录吗？" show-cancel-button></u-modal>
  </view>
</template>

<script>
import {getMyUserInfo, updateNickname} from "@/api/user";
import {baseServerUrl, nicknameMaxInput} from "@/config";

export default {
  data() {
    return {
      userInfo: {
        userId: 0,
        nickname: '未登录',
        avatar: '/static/images/logout_avatar.jpg',
      },
      newNickname: '',
      nicknameModalShow: false,
      logoutModalShow: false,
      nicknameMaxInput,
    }
  },
  onLoad(option) {
    this.userInfo.userId = option.userId
    this.userInfo.nickname = option.nickname
    this.userInfo.avatar = option.avatar
    this.newNickname = this.userInfo.nickname

    // 监听从裁剪页发布的事件，获得裁剪结果
    uni.$on('uAvatarCropper', path => {
      this.updateAvatar(path)
    })
  },
  methods: {
    getMyUserInfo() {
      getMyUserInfo().then(res => {
        this.userInfo = res
        this.newNickname = this.userInfo.nickname
      })
    },
    chooseAvatar() {
      uni.navigateTo({
        url: '/pages/profile/u-avatar-cropper',
      })
    },
    updateAvatar(path) {
      setTimeout(() => {
        uni.showLoading({
          title: '正在上传头像中...',
          mask: true
        })
      }, 400)

      uni.uploadFile({
        url: `${baseServerUrl}/service/user/updateAvatar`,
        header: {
          Authorization: `Bearer ${uni.getStorageSync('access_token')}`
        },
        filePath: path,
        name: 'file',
        complete: (res) => {
          uni.hideLoading()

          res = JSON.parse(res.data)
          if (res.code !== 200) {
            uni.showToast({
              title: res.msg || '上传失败',
              icon: 'none'
            })
          } else {
            this.getMyUserInfo()
            uni.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }
        }
      })
    },
    updateNickname() {
      updateNickname(this.newNickname).then(res => {
        this.getMyUserInfo()
        uni.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }).finally(() => {
        this.nicknameModalShow = false
      })
    },
    logout() {
      uni.clearStorageSync()
      uni.navigateBack()
    },
  }
}
</script>

<style scoped lang="scss">
.avatar-box {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user-avatar {
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
  }
}

.desc-box {
  padding: 20rpx 30rpx;

  .title {
    font-size: 24rpx;
    color: #aaa;
    display: flex;

    .text {
      margin-left: auto;
    }
  }

  .content {
    margin-top: 20rpx;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background: #1a1a1a;

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #555;
      font-size: 28rpx;
      height: 110rpx;

      &:last-child {
        border-bottom: none;
      }

      &-left {
        margin-left: 20rpx;
      }

      &-right {
        margin-right: 20rpx;
        color: #aaa;
        display: flex;

        .value {
          margin-right: 6rpx;
        }
      }
    }
  }
}

.logout-box {
  padding: 20rpx 30rpx;

  .content {
    padding: 0 20rpx;
    background: #1a1a1a;
    height: 90rpx;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      background: #333;
    }
  }
}

.nickname-modal-slot {
  padding: 40rpx 30rpx;

  .input {
    color: #000000;
    padding-bottom: 2px;
    border-bottom: 1px solid;
  }

  .tips {
    color: #aaa;
    font-size: 24rpx;
    margin-top: 10rpx;
    text-align: right;
  }
}
</style>
