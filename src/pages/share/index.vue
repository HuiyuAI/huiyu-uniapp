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
        <view class="left">
          <view class="date">
            <span class="label">生成时间：</span>
            <span class="value">{{ createTime | timeFormat('yyyy-mm-dd hh:MM') }}</span>
          </view>
        </view>

        <view class="right">
          <view class="item like" @click="likePic">
            <u-icon class="icon" :name="isLike ? 'heart-fill' : 'heart'" :style="{color: isLike ? '#F56C6C' : ''}"></u-icon>
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
        <button @click="redraw">再画一张</button>
      </view>
    </view>
  </view>
</template>

<script>
import {getPicDetail} from "@/api/pic";

export default {
  data() {
    return {
      uuid: '',
      image: '',
      status: '',
      width: 0,
      height: 0,
      prompt: '',
      negativePrompt: '',
      createTime: '',
      modelName: '',
      quality: '',
      ratio: '',
      cfg: '',
      steps: '',
      seed: '',
      modelId: 0,
      isLike: true,
      imgLoadError: false,
    }
  },
  computed: {
    aspectRatio() {
      return (this.height / this.width) * 100
    },
    content() {
      return [
        {label: '描述词', value: this.prompt},
        {label: '负向描述词', value: this.negativePrompt},
        {label: '模型名称', value: this.modelName},
        {label: '图片质量', value: this.quality},
        {label: '图片比例', value: this.ratio},
        {label: '图片宽度', value: this.width},
        {label: '图片高度', value: this.height},
        {label: '描述词相关度', value: this.cfg},
        {label: '采样步数', value: this.steps},
        {label: '随机种子', value: this.seed},
        {label: '图片ID', value: this.uuid},
      ]
    }
  },
  onLoad(option) {
    this.uuid = option.id
    this.image = option.image
    this.status = option.status
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
      getPicDetail(this.uuid).then(res => {
        this.image = res.path
        this.status = res.status
        this.prompt = res.prompt
        this.negativePrompt = res.negativePrompt
        this.createTime = res.createTime
        this.modelName = res.modelName
        this.quality = res.quality
        this.ratio = res.ratio
        this.cfg = res.cfg
        this.steps = res.steps
        this.seed = res.seed || ''
        this.modelId = res.modelId
      })
    },
    redraw() {
      const data = {
        prompt: this.prompt,
        modelId: this.modelId,
        ratio: this.ratio,
        quality: this.quality,
        negativePrompt: this.negativePrompt,
        cfg: this.cfg,
        steps: this.steps,
      }

      uni.$emit('redraw', data)

      uni.switchTab({
        url: `/pages/index/index`
      });
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
    padding: 20rpx 0;
    border-bottom: 1rpx solid #555555;

    .left {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #969696;
    }

    .right {
      display: flex;
      font-size: 34rpx;
      margin-left: auto;

      .item {
        display: flex;
        align-items: center;
        margin: 0 12rpx;

        .icon {
          margin-right: 8rpx;
        }

        &.like {
          .icon {
            font-size: 38rpx;
          }
        }

        &:last-child {
          margin-right: 0rpx;
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
