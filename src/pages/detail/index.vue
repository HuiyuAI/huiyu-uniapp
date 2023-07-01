<template>
  <view class="container">
    <view class="header">
      <view class="image" v-if="!imageLoadError">
        <u-image :src="image" @error="imgError" bg-color="transparent" :show-loading="false" :show-error="false" :lazy-load="false" mode="widthFix"></u-image>
      </view>
      <view class="error" v-else-if="imageLoadError">
        图片加载失败
      </view>
    </view>

    <view class="content">
      <view class="item">
        <span class="label">描述词：</span>
        <span class="value">{{ prompt }}</span>
      </view>
      <view class="item">
        <span class="label">生成时间：</span>
        <span class="value">{{ createTime | date('yyyy-mm-dd hh:MM') }}</span>
      </view>
      <view class="item">
        <span class="label">模型：</span>
        <span class="value">{{ modelName }}</span>
      </view>
      <view class="item">
        <span class="label">图片质量：</span>
        <span class="value">{{ quality }}</span>
      </view>
      <view class="item">
        <span class="label">图片比例：</span>
        <span class="value">{{ ratio }}</span>
      </view>
      <view class="item">
        <span class="label">宽度：</span>
        <span class="value">{{ width }}</span>
      </view>
      <view class="item">
        <span class="label">高度：</span>
        <span class="value">{{ height }}</span>
      </view>
      <view class="item">
        <span class="label">描述词相关度：</span>
        <span class="value">{{ cfg }}</span>
      </view>
      <view class="item">
        <span class="label">采样步数：</span>
        <span class="value">{{ steps }}</span>
      </view>
      <view class="item">
        <span class="label">随机种子：</span>
        <span class="value">{{ seed }}</span>
      </view>
      <view class="item">
        <span class="label">图片ID：</span>
        <span class="value">{{ uuid }}</span>
      </view>
    </view>

    <view class="safe-area"></view>

    <view class="footer">
      <view class="left">
        <view class="item">
          <u-icon name="home" :size="40"></u-icon>
          <view class="text u-line-1">下载</view>
        </view>
        <view class="item">
          <u-icon name="server-fill" :size="40"></u-icon>
          <view class="text u-line-1">删除</view>
        </view>
        <view class="item">
          <u-icon name="shopping-cart" :size="40"></u-icon>
          <view class="text u-line-1">精绘</view>
        </view>
        <view class="item">
          <u-icon name="shopping-cart" :size="40"></u-icon>
          <view class="text u-line-1">修脸</view>
        </view>
        <view class="item">
          <u-icon name="shopping-cart" :size="40"></u-icon>
          <view class="text u-line-1">海报</view>
        </view>
      </view>
      <view class="right">
        <button>再画一张</button>
      </view>
    </view>
  </view>
</template>

<script>
import {getPicDetail} from "@/api/pic";

export default {
  data() {
    return {
      imageLoadError: false,
      uuid: '',
      image: '',
      status: '',
      width: 0,
      height: 0,
      prompt: '',
      createTime: '',
      modelName: '',
      quality: '',
      ratio: '',
      cfg: '',
      steps: '',
      seed: '',
    }
  },
  onLoad(option) {
    this.uuid = option.id
    this.image = option.image
    this.status = option.status
    this.width = option.originWidth
    this.height = option.originHeight
    this.getPicDetail()
  },
  methods: {
    getPicDetail() {
      getPicDetail(this.uuid).then(res => {
        this.prompt = res.prompt
        this.createTime = res.createTime
        this.modelName = res.modelName
        this.quality = res.quality
        this.ratio = res.ratio
        this.cfg = res.cfg
        this.steps = res.steps
        this.seed = res.seed
      })
    },
    imgError() {
      this.imageLoadError = true
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  .error {
    width: 100%;
    padding: 50% 0;
    background-color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #969696;
  }
}

.content {
  padding: 20rpx 30rpx;

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

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 30rpx;
    }
  }

  .right {
    margin-left: auto;
    margin-right: 30rpx;

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
