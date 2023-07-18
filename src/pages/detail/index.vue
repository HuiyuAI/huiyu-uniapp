<template>
  <view class="container">
    <view class="header">
      <view class="image-box" v-if="status === 'GENERATED'" :style="{paddingBottom: aspectRatio + '%'}">
        <view class="image">
          <u-image :src="image" @click="previewImage" @error="imgLoadError" :show-menu-by-longpress="false"
                   bg-color="transparent" :show-loading="false" :show-error="false" :lazy-load="false" mode="widthFix"></u-image>
        </view>
      </view>

      <view v-else class="img-status-box">
        <view class="img-status-text">
          <view class="u-text-center" v-html="imgStatusText"></view>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="item" v-for="(item,index) in content" :key="index">
        <span class="label">{{ item.label }}：</span>
        <span class="value">{{ item.value }}</span>
      </view>
    </view>

    <view class="safe-area"></view>

    <view class="footer">
      <view class="left">
        <view class="item" @click="$u.throttle(saveImage, 3000)">
          <text class="iconfont icon-xiazai"></text>
          <view class="u-line-1">下载</view>
        </view>
        <view class="item" @click="$u.throttle(restoreFaceModalShow=true, 2000)">
          <text class="iconfont icon-xiulian"></text>
          <view class="u-line-1">修脸</view>
        </view>
        <view class="item">
          <text class="iconfont icon-meihua"></text>
          <view class="u-line-1">精绘</view>
        </view>
        <view class="item">
          <text class="iconfont icon-fenxiang"></text>
          <view class="u-line-1">分享</view>
        </view>
      </view>
      <view class="right">
        <button>再画一张</button>
      </view>
    </view>

    <u-modal v-model="restoreFaceModalShow" @confirm="restoreFace" title="修脸" content="针对模糊不清的人脸进行智能识别修复，将会生成一张新图，风景类场景请勿使用" show-cancel-button></u-modal>
    <u-modal v-model="albumPermissionRequest" @confirm="toOpenSetting" content="请先开启保存相册权限" show-cancel-button></u-modal>
    <u-toast ref="uToast"/>
  </view>
</template>

<script>
import {getPicDetail} from "@/api/pic";
import {restoreFace} from "@/api/sd";

export default {
  data() {
    return {
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
      imageLoadError: false,
      restoreFaceModalShow: false,
      albumPermissionRequest: false,
      statusPollTimer: null,
    }
  },
  computed: {
    aspectRatio() {
      return (this.height / this.width) * 100
    },
    imgStatusText() {
      switch (this.status) {
        case 'GENERATING':
          return '图片正在生成中'
        case 'DISCARD':
          return '图片生成失败<br>积分已返还您的账户'
        default:
          return '图片加载失败'
      }
    },
    content() {
      return [
        {label: '描述词', value: this.prompt},
        {label: '生成时间', value: this.$u.timeFormat(this.createTime, 'yyyy-mm-dd hh:MM')},
        {label: '模型名称', value: this.modelName},
        {label: '图片质量', value: this.quality},
        {label: '图片比例', value: this.ratio},
        {label: '宽度', value: this.width},
        {label: '高度', value: this.height},
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

    // 查询图片详情，第一次立即执行
    this.getPicDetail()
    if (this.status !== 'GENERATING') {
      // 图片不是生成中状态，不需要轮询
      return
    }
    if (this.status === 'GENERATING') {
      // 每2秒查询一次
      this.statusPollTimer = setInterval(() => {
        this.getPicDetail()
        if (this.status !== 'GENERATING') {
          clearInterval(this.statusPollTimer)
        }
      }, 2000)
    }
  },
  onUnload() {
    // 页面卸载时清除轮询器
    clearInterval(this.statusPollTimer)
  },
  methods: {
    getPicDetail() {
      getPicDetail(this.uuid).then(res => {
        this.status = res.status
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
    imgLoadError() {
      this.status = 'ERROR'
    },
    previewImage() {
      uni.previewImage({
        urls: [this.image],
      });
    },
    restoreFace() {
      uni.showLoading({
        title: '正在提交任务中...',
        mask: true
      });

      restoreFace({imageUuid: this.uuid}).then(res => {
        console.log(res)
      }).finally(() => {
        setTimeout(() => {
          uni.hideLoading()
        }, 2000)
      })
    },
    saveImage() {
      uni.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
            // 如果是undefined，则是第一次授权，直接申请权限
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.saveImageToPhotosAlbum()
              },
            })
          } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
            // 如果是false，则是用户拒绝过授权，模态框提示用户进入权限设置界面打开授权
            this.albumPermissionRequest = true
          } else {
            // 已经授权，直接保存图片
            this.saveImageToPhotosAlbum()
          }
        }
      })
    },
    saveImageToPhotosAlbum() {
      uni.downloadFile({
        url: this.image,
        success: res => {
          if (res.statusCode === 200) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                this.$refs.uToast.show({
                  title: '保存图片成功！',
                  type: 'success',
                })
              },
              fail: () => {
                this.$refs.uToast.show({
                  title: '保存图片失败！',
                  type: 'error',
                })
              }
            })
          }
        },
      })
    },
    toOpenSetting() {
      // 调起小程序权限设置界面，让用户开启访问相册权限
      uni.openSetting()
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
    margin-left: 40rpx;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 34rpx;

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
