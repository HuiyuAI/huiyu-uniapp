<template>
  <view class="container">
    <view class="header">
      <view class="image-box" v-if="isGeneratedStatus" :style="{paddingBottom: aspectRatio + '%'}">
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
      <view class="action" v-if="isGeneratedStatus">
        <view class="left">
          <view class="date">
            <span class="label">生成时间：</span>
            <span class="value">{{ createTime | timeFormat('yyyy-mm-dd hh:MM') }}</span>
          </view>
        </view>

        <view class="right">
          <view class="item share" @click="$u.throttle(clickShareButton, 1000)">
            <text class="icon iconfont icon-fabu1"></text>
            <view class="u-line-1">{{ shareButtonText }}</view>
          </view>
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
      <view class="left" v-if="isGeneratedStatus">
        <view class="item" @click="$u.throttle(saveImage, 3000)">
          <text class="iconfont icon-xiazai"></text>
          <view class="u-line-1">下载</view>
        </view>
        <view class="item" @click="$u.throttle(restoreFaceModalShow=true, 2000)">
          <text class="iconfont icon-xiulian"></text>
          <view class="u-line-1">修脸</view>
        </view>
        <view class="item" @click="$u.throttle(clickSuperResolution, 2000)">
          <text class="iconfont icon-k-line"></text>
          <view class="u-line-1">超分</view>
        </view>
        <view class="item">
          <text class="iconfont icon-meihua"></text>
          <view class="u-line-1">精绘</view>
        </view>
      </view>
      <view class="right">
        <button @click="redraw">再画一张</button>
      </view>
    </view>

    <u-popup v-model="sharePicPopupShow" mode="top">
      <!-- 作品标题 -->
      <view class="share-form">
        <view class="share-form__item">
          <view class="item-title">作品标题（选填）</view>
          <view class="item-input">
            <input v-model="shareTitle" type="text" maxlength="20" placeholder="请输入作品标题"/>
          </view>
          <view class="item-input-tips">{{ shareTitle.length }}/{{ shareTitleMaxInput }}</view>
        </view>
        <view class="share-form__item">
          <view class="item-tips">Tips: 审核通过后会有积分奖励，建议提升作品分辨率后投稿，质量过低的作品可能被审核拒绝发布哦~</view>
        </view>

        <view class="share-form__footer">
          <u-button throttle-time="0" size="medium" type="primary" :plain="false" :loading="sharePicLoading" @click="sharePic">确认投稿</u-button>
        </view>
      </view>
    </u-popup>

    <u-modal v-model="restoreFaceModalShow" @confirm="restoreFace" async-close title="修脸" :confirm-text="`确定(消耗${restoreFacePoint}积分)`" content="针对脸部智能重绘修复，适用于远景中的模糊人脸，将会生成一张新图，风景类场景无效请勿使用" show-cancel-button></u-modal>
    <u-modal v-model="superResolutionModalShow" @confirm="superResolution" async-close title="超分辨率4K" :confirm-text="`确定(消耗${superResolutionPoint}积分)`" content="对当前1080P图片AI超分辨率至4K，提升画质和清晰度" show-cancel-button></u-modal>
    <u-modal v-model="superResolutionNonsupportModalShow" confirm-text="确定" title="超分辨率4K" :content="`当前图片质量为【${quality}】，暂不支持该质量图片超分，请对【超清】质量图片使用`"></u-modal>
    <u-modal v-model="albumPermissionRequest" @confirm="toOpenSetting" content="请先开启保存相册权限" show-cancel-button></u-modal>
    <u-toast ref="uToast"/>
  </view>
</template>

<script>
import {getPicDetail, share} from "@/api/pic";
import {restoreFace, superResolution} from "@/api/sd";
import {shareTitleMaxInput, restoreFacePoint, superResolutionPoint} from "@/config"

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
      seed: '',
      modelId: 0,
      isLike: true,
      imageLoadError: false,
      sharePicPopupShow: false,
      restoreFaceModalShow: false,
      albumPermissionRequest: false,
      statusPollTimer: null,
      shareStatus: 'NONE',
      shareTitle: '',
      sharePicLoading: false,
      restoreFacePoint,
      shareTitleMaxInput,
      superResolutionModalShow: false,
      superResolutionNonsupportModalShow: false,
      superResolutionPoint,
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
        case 'RISKY':
          return '图片检测违规'
        default:
          return '图片加载失败'
      }
    },
    shareButtonText() {
      switch (this.shareStatus) {
        case 'NONE':
          return '投稿'
        case 'AUDITING':
          return '审核中'
        case 'PUBLIC':
          return '已公开'
        case 'REJECT':
          return '审核未通过'
      }
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
        {label: '随机种子', value: this.seed},
        {label: '图片ID', value: this.uuid},
      ]
    },
    isGeneratedStatus() {
      return this.status === 'GENERATED'
    },
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

    // 查询图片详情，第一次立即执行
    this.getPicDetail()
    // 图片生成中状态，需要轮询
    if (this.status === 'GENERATING') {
      // 每2秒查询一次
      this.statusPollTimer = setInterval(() => {
        this.getPicDetail()
        if (this.status !== 'GENERATING') {
          clearInterval(this.statusPollTimer)
          // 通知画夹页图片生成完毕
          this.eventChannel.emit('onImageGenerated', {
            uuid: this.uuid,
            image: this.image,
          })
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
        this.image = res.path
        this.status = res.status
        this.prompt = res.prompt
        this.negativePrompt = res.negativePrompt
        this.createTime = res.createTime
        this.modelName = res.modelName
        this.quality = res.quality
        this.ratio = res.ratio
        this.cfg = res.cfg
        this.seed = res.seed || ''
        this.modelId = res.modelId
        this.shareStatus = res.shareStatus
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
    redraw() {
      const data = {
        prompt: this.prompt,
        modelId: this.modelId,
        ratio: this.ratio,
        quality: this.quality,
        negativePrompt: this.negativePrompt,
        cfg: this.cfg,
      }

      uni.$emit('redraw', data)

      uni.switchTab({
        url: `/pages/index/index`
      });
    },
    restoreFace() {
      restoreFace({imageUuid: this.uuid}).then(res => {
        this.toDetailPage(res)
      }).finally(() => {
        this.restoreFaceModalShow = false
      })
    },
    clickSuperResolution() {
      if (this.quality === '超清') {
        this.superResolutionModalShow = true
      } else {
        this.superResolutionNonsupportModalShow = true
      }
    },
    superResolution() {
      superResolution({imageUuid: this.uuid}).then(res => {
        this.toDetailPage(res)
      }).finally(() => {
        this.superResolutionModalShow = false
      })
    },
    clickShareButton() {
      if (this.shareStatus === 'NONE') {
        this.sharePicPopupShow = true
      }
    },
    sharePic() {
      this.sharePicLoading = true
      share(this.uuid, this.shareTitle).then(res => {
        this.shareStatus = 'AUDITING'
        this.$refs.uToast.show({
          title: '提交审核成功！',
          type: 'success',
        })
      }).finally(() => {
        this.sharePicLoading = false
        this.sharePicPopupShow = false
      })
    },
    likePic() {
      this.isLike = !this.isLike

      // 防抖
      this.$u.debounce(() => {
        // 请求
      }, 500)
    },
    toDetailPage(res) {
      const item = {
        id: res.uuid,
        image: res.path,
        status: res.status,
        originWidth: res.width,
        originHeight: res.height,
      }

      const query = this.$u.queryParams(item)
      uni.navigateTo({
        url: `/pages/detail/index${query}`,
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

  .action {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #555555;
    margin-bottom: 20rpx;

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

        &.share {
          .icon {
            font-size: 36rpx;
          }
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

.share-form {
  &__item {
    color: #000000;

    .item-title {
      margin: 20rpx 20rpx 0;
      font-size: 30rpx;
      font-weight: bold;
    }

    .item-input {
      margin: 10rpx 20rpx;
      padding-bottom: 2px;
      border-bottom: 1px solid;
    }

    .item-input-tips {
      color: #aaa;
      font-size: 24rpx;
      margin: 10rpx 20rpx;
      text-align: right;
    }

    .item-tips {
      margin: 30rpx 20rpx 0;
      font-size: 24rpx;
      color: #555555;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 100rpx 0 40rpx;
  }
}
</style>
