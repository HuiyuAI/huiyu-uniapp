<template>
  <view class="container">
    <view class="user-box" @click="$u.throttle(login, 1000)">
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
      <Card :columns="cardColumns" @card-column-clicked="handleCardColumnClick"/>
    </view>

    <view class="daily-task-title">
      每日任务
    </view>

    <view class="task-wrapper">
      <view class="task-content">
        <view class="task-content__item" v-for="(item,index) in dailyTaskList" :key="index">
          <view :class="['task-content__item-left', item.desc ? '' : 'no-desc']">
            <view class="title">
              <text>{{ item.title }}</text>
              <view class="point">
                <view class="t-icon t-icon-point"></view>
                <span>{{ `+${item.point}` }}</span>
              </view>
            </view>
            <view class="desc">{{ item.desc }}</view>
          </view>

          <view class="task-content__item-right finished" v-if="item.status">
            <view class="task-content__item-right-text">{{ item.action }}</view>
          </view>
          <view class="task-content__item-right unfinished" v-else @click="toTab(item)">
            <view class="task-content__item-right-text">{{ item.action }}</view>
          </view>
        </view>
      </view>
    </view>

    <u-modal v-model="tipsPointModelShow" confirm-text="确定" title="积分说明" :content="tipsPointModelContent"></u-modal>

    <u-modal v-model="cdkeyModalShow" @confirm="useCdkey" async-close title="兑换码" confirm-text="确定" show-cancel-button negative-top="500rpx">
      <view class="cdkey-modal-slot">
        <view class="input">
          <input v-model="cdkey" type="text" placeholder="请输入兑换码" :adjust-position="true"/>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import {login} from "@/api/login";
import {getDailyTaskPoint, getMyUserInfo} from "@/api/user";
import {parseJwtPayload2Obj} from "@/util/jwtUtils";
import Card from "./components/card.vue"

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
      cardColumns: [
        {name: '积分记录', icon: 'icon-jiludanzilishijilu', click: 'clickPointRecord'},
        {name: '邀请好友', icon: 'icon-yaoqing', click: 'clickInviteFriends'},
        {name: '邀请码', icon: 'icon-yaoqinghaoyou', click: 'clickInviteCode'},
        {name: '兑换码', icon: 'icon-gift', click: 'clickCDKey'},
      ],
      dailyTaskPointList: {
        signIn: 100,
        generatePic: 10,
        sharePic: 10,
        sharePass: 5,
        inviteUser: 100,
      },
      dailyTaskListTmp: [
        {key: 'signIn', title: '每日签到', desc: '', point: '', status: false, action: '未完成', page: ''},
        {key: 'generatePic', title: '完成创作', desc: '', point: '', status: false, action: '去创作', page: '/pages/index/index'},
        {key: 'sharePic', title: '投稿作品', desc: '', point: '', status: false, action: '去投稿', page: '/pages/pic/index'},
        {key: 'sharePass', title: '投稿通过', desc: '', point: '', status: false, action: '去投稿', page: '/pages/pic/index'},
        {key: 'inviteUser', title: '邀请好友', desc: '', point: '', status: false, action: '去邀请', page: ''},
      ],
      tipsPointModelShow: false,
      tipsPointModelContent: '',
      cdkeyModalShow: false,
      cdkey: '',
    }
  },
  computed: {
    dailyTaskList: {
      get() {
        this.dailyTaskListTmp.map(item => {
          const point = this.dailyTaskPointList[item.key]
          item.point = `${point}${item.key === 'signIn' ? ' (当日过期)' : ''}`
        })
        return this.dailyTaskListTmp
      },
      set(val) {
        this.dailyTaskListTmp = val
      }
    }
  },
  onLoad() {
    this.getDailyTaskPoint()
  },
  onShow() {
    if (!this.isLogin()) {
      this.initLogoutUserInfo()
      return
    }
    this.getMyUserInfo()
  },
  methods: {
    getDailyTaskPoint() {
      getDailyTaskPoint().then(res => {
        this.dailyTaskPointList = res
      })
    },
    isLogin() {
      const accessToken = uni.getStorageSync('access_token')
      return accessToken ? true : false
    },
    initLogoutUserInfo() {
      this.userInfo = {
        userId: 0,
        nickname: '未登录',
        avatar: '/static/images/logout_avatar.jpg',
        dailyPoint: 0,
        point: 0,
      }
      this.dailyTaskList = [
        {key: 'signIn', title: '每日签到', desc: '', point: '', status: false, action: '未完成', page: ''},
        {key: 'generatePic', title: '完成创作', desc: '', point: '', status: false, action: '去创作', page: '/pages/index/index'},
        {key: 'sharePic', title: '投稿作品', desc: '', point: '', status: false, action: '去投稿', page: '/pages/pic/index'},
        {key: 'sharePass', title: '投稿通过', desc: '', point: '', status: false, action: '去投稿', page: '/pages/pic/index'},
        {key: 'inviteUser', title: '邀请好友', desc: '', point: '', status: false, action: '去邀请', page: ''},
      ]
    },
    async login() {
      if (this.userInfo.userId !== 0) {
        this.toProfile()
        return
      }

      uni.showLoading({
        title: '正在登录...',
        mask: true
      })

      let data = {}
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

        uni.hideLoading()
      })
    },
    getMyUserInfo() {
      getMyUserInfo().then(res => {
        this.userInfo = res
        this.dailyTaskList = this.dailyTaskList.map(item => {
          const resItem = res.dailyTaskList.find(resItem => resItem.key === item.key)
          if (resItem) {
            item.desc = resItem.desc
            item.status = resItem.status
            item.action = resItem.action
          }
          return item
        })
      })
    },
    tipsPoint(index) {
      if (index === 1) {
        this.tipsPointModelContent = `每日赠送：每天登录后自动补充至${this.dailyTaskPointList.signIn}，当天24点过期`
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
    toProfile() {
      const data = {
        userId: this.userInfo.userId,
        nickname: this.userInfo.nickname,
        avatar: this.userInfo.avatar,
      }
      const query = this.$u.queryParams(data)
      uni.navigateTo({
        url: `/pages/profile/index${query}`,
      })
    },
    handleCardColumnClick(item) {
      this[item.click]()
    },
    clickPointRecord() {
      uni.navigateTo({
        url: '/pages/record/index'
      })
    },
    clickInviteFriends() {

    },
    clickInviteCode() {

    },
    clickCDKey() {
      this.cdkeyModalShow = true
    },
    useCdkey() {
      setTimeout(() => {
        this.cdkeyModalShow = false
        uni.showToast({
          title: '兑换码错误',
          icon: 'none',
          duration: 2000
        })
      }, 1000)
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

        .title {
          display: flex;
          font-size: 28rpx;
          align-items: center;

          .point {
            display: inline-flex;
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
        }

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

      &-right {
        margin-right: 20rpx;
        font-size: 24rpx;
        padding: 10rpx 20rpx;
        border: 1rpx solid $huiyu-color-main;
        border-radius: 10rpx;
        min-width: 120rpx;
        justify-content: center;

        &.finished {
          color: $huiyu-color-main;
        }

        &.unfinished {
          color: black;
          background: $huiyu-color-button;
        }

        &-text {
          text-align: center;
        }
      }
    }
  }
}

.cdkey-modal-slot {
  padding: 40rpx 30rpx;

  .input {
    color: #000000;
    padding-bottom: 2px;
    border-bottom: 1px solid;
  }
}
</style>
