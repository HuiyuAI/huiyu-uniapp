<template>
  <view class="container">
    <view class="header">
      <view class="image-box" v-if="!imgLoadError" :style="{paddingBottom: aspectRatio + '%'}">
        <view class="image">
          <u-image :src="image" @error="imgLoadError=true" :show-menu-by-longpress="false"
                   bg-color="transparent" :show-loading="false" :show-error="false" :lazy-load="false" mode="widthFix"></u-image>
        </view>
      </view>

      <view v-else class="img-status-box">
        <view class="img-status-text">
          <view class="u-text-center">图片加载失败</view>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="action">
        <view class="title" v-if="title">{{ title }}</view>
        <view class="info">
          <view class="left">
            <image :src="userAvatar" class="avatar" mode="aspectFill"></image>
            <view class="nickname">{{ userNickname }}</view>
          </view>
          <view class="right">
            <view class="item">
              <u-icon class="icon" name="heart-fill" style="color: #F56C6C"></u-icon>
              <view class="u-line-1">{{ likeCount }}</view>
            </view>
            <view class="item" @click="likePic">
              <u-icon class="icon" :name="isLike ? 'heart-fill' : 'heart'" :style="{color: isLike ? '#F56C6C' : ''}"></u-icon>
              <view class="u-line-1">{{ likeCount }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="pic-detail">
        <view class="item" v-for="(item,index) in content" :key="index" v-if="item.value">
          <span class="label">{{ item.label }}：</span>
          <span class="value">{{ item.value }}</span>
        </view>
      </view>
    </view>

    <view class="safe-area"></view>

    <view class="footer">
      <view class="left">
        <view class="item">
          <text class="iconfont icon-meihua"></text>
          <view class="u-line-1">精绘</view>
        </view>
      </view>
      <view class="right">
        <button @click="redraw">画同款</button>
      </view>
    </view>
  </view>
</template>

<script>
import {getPicShare, redraw} from "@/api/pic";

export default {
  data() {
    return {
      uuid: '',
      image: '',
      width: 0,
      height: 0,
      modelId: 0,
      modelName: '',
      quality: '',
      ratio: '',
      cfg: '',
      userNickname: '',
      userAvatar: '',
      title: '',
      likeCount: 0,
      drawCount: 0,
      isLike: true,
      auditTime: '',
      imgLoadError: false,
    }
  },
  computed: {
    aspectRatio() {
      return (this.height / this.width) * 100
    },
    content() {
      return [
        {label: '投稿时间', value: this.$u.timeFormat(this.auditTime, 'yyyy-mm-dd hh:MM')},
        {label: '描述词', value: '画同款可见'},
        {label: '负向描述词', value: '画同款可见'},
        {label: '模型名称', value: this.modelName},
        {label: '图片质量', value: this.quality},
        {label: '图片比例', value: this.ratio},
        {label: '图片宽度', value: this.width},
        {label: '图片高度', value: this.height},
        {label: '描述词相关度', value: this.cfg},
        {label: '图片ID', value: this.uuid},
      ]
    }
  },
  onLoad(option) {
    this.uuid = option.id
    this.image = option.image
    this.width = option.originWidth
    this.height = option.originHeight

    // #ifndef APP-NVUE
    this.eventChannel = this.getOpenerEventChannel()
    // #endif

    this.getPicDetail()
    // this.eventChannel.emit('onImageGenerated', {
    //   uuid: this.uuid,
    //   image: this.image,
    // })
  },
  methods: {
    getPicDetail() {
      getPicShare(this.uuid).then(res => {
        this.modelId = res.modelId
        this.modelName = res.modelName
        this.quality = res.quality
        this.ratio = res.ratio
        this.cfg = res.cfg
        this.userNickname = res.userNickname
        this.userAvatar = res.userAvatar
        this.title = res.title
        this.likeCount = res.likeCount
        this.drawCount = res.drawCount
        this.isLike = res.isLike
        this.auditTime = res.auditTime
      })
    },
    redraw() {
      const data = {
        modelId: this.modelId,
        ratio: this.ratio,
        quality: this.quality,
        cfg: this.cfg,
      }

      redraw(this.uuid).then(res => {
        data.prompt = res.prompt
        data.negativePrompt = res.negativePrompt

        uni.$emit('redraw', data)

        uni.switchTab({
          url: `/pages/index/index`
        });
      })
    },
    likePic() {
      this.isLike = !this.isLike

      // 防抖
      this.$u.debounce(() => {
        // 请求
      }, 500)
    },
  }
}
</script>

<style lang="scss" scoped>
.header {
  .image-box {
    position: relative;
    width: 100%;

    .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .img-status-box {
    position: relative;
    background-color: #1a1a1a;
    width: 100%;
    padding-bottom: 100%;

    .img-status-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 24rpx;
      color: #969696;
    }
  }
}

.content {
  padding: 20rpx 30rpx;

  .action {
    display: flex;
    flex-direction: column;
    padding: 10rpx 0 20rpx;
    border-bottom: 1rpx solid #555555;

    .title {
      font-size: 32rpx;
      margin-bottom: 20rpx;
    }

    .info {
      display: flex;

      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
        }

        .nickname {
          margin-left: 8rpx;
          font-size: 28rpx;
        }
      }

      .right {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 34rpx;
        color: #969696;

        .item {
          display: flex;
          align-items: center;
          margin: 0 12rpx;

          .icon {
            font-size: 38rpx;
            margin-right: 8rpx;
          }

          &:last-child {
            margin-right: 0rpx;
          }
        }
      }
    }
  }

  .pic-detail {
    margin-top: 20rpx;

    .item {
      font-size: 28rpx;
      line-height: 40rpx;
      margin-bottom: 20rpx;

      .label {
        color: #969696;
      }

      .value {
        overflow-wrap: break-word;
        word-break: break-all;
        color: #e0e0e0;
      }
    }
  }
}

.safe-area {
  padding-bottom: 200rpx;
  padding-bottom: calc(200rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 14rpx;
  padding-bottom: 14rpx;
  padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
  display: flex;
  background-color: #1a1a1a;

  .left {
    display: flex;
    font-size: 24rpx;
    margin-left: 40rpx;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 24rpx;

      &:first-child {
        margin-left: 0rpx;
      }
    }
  }

  .right {
    margin-left: auto;
    margin-right: 40rpx;

    button {
      background: $huiyu-color-button;
      color: black;
      border-radius: 80rpx;
      font-size: 28rpx;
      font-weight: bold;
    }
  }
}
</style>
