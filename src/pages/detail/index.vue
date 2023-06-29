<template>
  <view class="container">
    <!--    <view class="image">-->
    <!--      <u-image :src="image" lazy-load="false" mode="widthFix">-->
    <!--        <view slot="error">-->
    <!--          <u-image :src="errorImg" lazy-load="false" mode="widthFix"></u-image>-->
    <!--&lt;!&ndash;          <image :src="errorImg" mode="widthFix"></image>&ndash;&gt;-->
    <!--          图片加载失败-->
    <!--        </view>-->
    <!--      </u-image>-->
    <!--    </view>-->


    <view class="header">
      <u-image :src="image" lazy-load="false" mode="widthFix"></u-image>
    </view>


    <view class="content">
      <view class="item">
        <span class="label">描述词：</span>
        <span class="value">{{ prompt }}</span>
      </view>
      <view class="item">
        <span class="label">高度：</span>
        <span class="value">{{ height }}</span>
      </view>
      <view class="item">
        <span class="label">比例：</span>
        <span class="value">{{ ratio }}</span>
      </view>
      <view class="item">
        <span class="label">描述词：</span>
        <span class="value">{{ prompt }}</span>
      </view>
      <view class="item">
        <span class="label">高度：</span>
        <span class="value">{{ height }}</span>
      </view>
      <view class="item">
        <span class="label">比例：</span>
        <span class="value">{{ ratio }}</span>
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
      uuid: '',
      image: 'https://huiyucdn.naccl.top/gen/714d0797-b78b-4dcd-b991-97542eee33ad.jpg',
      errorImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAAXNSR0IArs4c6QAAHC9JREFUeF7t3Q2QpHldH/D/v+d2PXeRkxcPzAEWQS0IGGIoKL34ghJAoyBQgBS+JPhy4uZmnn/vnXeKL3hRA17u5vn3bXGE8wUsFEQ0iqggGnw3iSaEJJoyipYEjsPcnXoge3CzM3/rmXRP9Q6zuzO/ndmZqfp01dTsdD/f//PMp3913+vp7qdzciFAgAABAgGBHMiIECBAgACBpEAMAQECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICCiTEJkSAAAECCsQMECBAgEBIQIGE2IQIECBAQIGYAQIECBAICSiQEJsQAQIECCgQM0CAAAECIQEFEmITIkCAAAEFYgYIECBAICSgQEJsQgQIECCgQMwAAQIECIQEFEiITYgAAQIEFIgZIECAAIGQgAIJsQkRIECAgAIxAwQIECAQElAgITYhAgQIEFAgZoAAAQIEQgIKJMQmRIAAAQIKxAwQIECAQEhAgYTYhAgQIEBAgZgBAgQIEAgJKJAQmxABAgQIKBAzQIAAAQIhAQUSYhMiQIAAAQViBggQIEAgJKBAQmxCBAgQIKBAzAABAgQIhAQUSIhNiAABAgQUiBkgQIAAgZCAAgmxCREgQICAAjEDBAgQIBASUCAhNiECBAgQUCBmgAABAgRCAgokxCZEgAABAgrEDBAgQIBASECBhNiECBAgQECBmAECBAgQCAkokBCbEAECBAgoEDNAgAABAiEBBRJiEyJAgAABBWIGCBAgQCAkoEBCbEIECBAgoEDMAAECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICCiTEJkSAAAECCsQMECBAgEBIQIGE2IQIECBAQIGYAQIECBAICSiQEJsQAQIECCgQM0CAAAECIQEFEmITIkCAAAEFYgYIECBAICSgQEJsQgQIECCgQMwAAQIECIQEFEiITYgAAQIEFIgZIECAAIGQgAIJsQkRIECAgAIxAwQIECAQElAgITYhAgQIEFAgZoAAAQIEQgIKJMQmRIAAAQIKxAwQIECAQEhAgYTYhAgQIEBAgZgBAgQIEAgJKJAQmxABAgQIKBAzQIAAAQIhAQUSYhMiQIAAAQViBggQIEAgJKBAQmxCBAgQIKBAzAABAgQIhAQUSIhNiAABAgQUiBkgQIAAgZCAAgmxCREgQICAAjEDBAgQIBASUCAhNiECBAgQUCBmgAABAgRCAgokxCZEgAABAgrEDBAgQIBASECBhNiECBAgQECBmAECBAgQCAkokBCbEAECBAgoEDNAgAABAiEBBRJiEyJAgAABBWIGCBAgQCAkoEBCbEIECBAgoEDMAAECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICCiTEJkSAAAECCsQMECBAgEBIQIGE2IQIECBAQIGYAQIECBAICSiQEJsQAQIECCgQM0CAAAECIQEFEmITIkCAAAEFYgYIECBAICSgQEJsQgQIECCgQMwAAQIECIQEFEiITYgAAQIEFIgZIECAAIGQgAIJsQkRIECAgAIxAwQIECAQElAgITYhAgQIEFAgZoAAAQIEQgIKJMQmRIAAAQIKxAwQIECAQEhAgYTYhAgQIEBAgZgBAgQIEAgJKJAQmxABAgQIKBAzQIAAAQIhAQUSYhMiQIAAAQViBggQIEAgJKBAQmxCBAgQIKBAzAABAgQIhAQUSIhNiAABAgQUiBkgQIAAgZCAAgmxCREgQICAAjEDBAgQIBASUCAhNiECBAgQUCBmgAABAgRCAgokxCZEgAABAgrEDBAgQIBASECBhNiECBAgQECBmAECBAgQCAkokBCbEAECBAgoEDNAgAABAiEBBRJiEyJAgAABBWIGCBAgQCAkoEBCbEIECBAgoEDMAAECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICCiTEJkSAAAECCsQMECBAgEBIQIGE2IQIECBAQIGYAQIECBAICSiQEJsQAQIECCgQM0CAAAECIQEFEmITIkCAAAEFYgYIECBAICSgQEJsQgQIECCgQMwAAQIECIQEFEiITYgAAQIEFIgZIECAAIGQgAIJsQkRIECAgAIxAwQIECAQElAgITYhAgQIEFAgZoAAAQIEQgIKJMQmRIAAAQIKxAwQIECAQEhAgYTYhAgQIEBAgZgBAgQIEAgJKJAQ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CBAgoEDMAAECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICCiTEJkSAAAECCsQMECBAgEBIQIGE2IQIECBAQIGYAQIECBAICSiQEJsQAQIECCgQM0CAAAECIQEFEmITIkCAAAEFYgYIECBAICSgQEJsQgQIECCgQMwAAQIECIQEFEiITYgAAQIEFIgZIECAAIGQgAIJsQkRIECAgAIxAwQIECAQElAgITYhAgQIEFAgZoAAAQIEQgIKJMQmRIAAAQIKxAwQIECAQEhAgYTYhAgQIEBAgZgBAgQIEAgJKJAQmxABAgQIKBAzQIAAAQIhAQUSYhMiQIAAAQViBggQIEAgJKBAQmxCBAgQIKBAzAABAgQIhAQUSIhNiAABAgQUiBkgQIAAgZCAAgmxCREgQICAAjEDBAgQIBASUCAhNiECBAgQUCBmgAABAgRCAgokxCZEgAABAgrEDBAgQIBASECBhNiECBAgQECBmAECBAgQCAkokBCbEAECBAgoEDNAgAABAiEBBRJiEyJAgAABBWIGCBAgQCAkoEBCbEIECBAgoEDMAAECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICCiTEJkSAAAECCsQMECBAgEBIQIGE2IQIECBAQIGYAQIECBAICSiQEJsQAQIECCgQM0CAAAECIQEFEmITIkCAAAEFYgYIECBAICSgQEJsQgQIECCgQMwAAQIECIQEFEiITYgAAQIEFIgZIECAAIGQgAIJsQkRIECAgAIxAwQIECAQElAgITYhAgQIEFAgZoAAAQIEQgIKJMQmRIAAAQIKxAwQIECAQEhAgYTYhAgQIEBAgZgBAgQIEAgJKJAQmxABAgQIKBAzQIAAAQIhAQUSYhMiQIAAAQViBggQIEAgJKBAQmxCBAgQIKBAzAABAgQIhAQUSIhNiAABAgQUiBkgQIAAgZCAAgmxCREgQICAAjEDBAgQIBASUCAhNiECBAgQUCBmgAABAgRCAgokxCZEgAABAgrEDBAgQIBASECBhNiECBAgQECBmAECBAgQCAkokBCbEAECBAgoEDNAgAABAiEBBRJiEyJAgAABBWIGCBAgQCAkoEBCbEIECBAgoEDMAAECBAiEBBRIiE2IAAECBBSIGSBAgACBkIACCbEJESBAgIACMQMECBAgEBJQICE2IQIECBBQIGaAAAECBEICfw/SotDNxtksnAAAAABJRU5ErkJggg==',
      prompt: 'masterpiece,best quality,official art,extremely detailed CG unity 8k wallpaper, illustration, landscape, 1girl, solo, standing, long hair, from behind, outdoors, day, blue sky, cloud, plant, inverted reflection in water, rainbow, house, scenery, utility pole, power lines, summer, railing, cumulonimbus cloud, octans, <lora:LoconLoraOctansStyle_loconV10:1>',
      width: 1080,
      height: 1920,
      ratio: '16:9',
    }
  },
  onLoad(option) {
    this.uuid = option.uuid
    this.getPicDetail()
  },
  methods: {
    getPicDetail() {
      // getPicDetail(this.uuid).then(res => {
      //   console.log(res)
      // })
    },
  }
}
</script>

<style lang="scss" scoped>
.header {

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
