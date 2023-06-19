<template>
  <view class="com-pic-draw">
    <scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px'">
      <!-- 正向描述词 -->
      <view class="input-item">
        <view class="section">
          <view class="title">画面描述</view>
          <view class="title-desc">(建议以推荐词为基础修改)</view>
        </view>
        <view class="text-area">
          <textarea v-model="cueword" placeholder="输入你想要的内容，短语单词为佳，支持中英文，用逗号分割。" :maxlength="maxinput"></textarea>
        </view>
        <view class="text-num-box">
          <view class="text-num">{{ cueword_num }}/{{ maxinput }}</view>
        </view>
      </view>
      <view class="recommended-word-box">
        <view class="recommended-word" @click="recommendedWord">
          <text class="iconfont icon-qiehuan"></text>
          点击试试推荐词
        </view>
      </view>
      <!-- 模型选择 -->
      <view class="box-content model-box">
        <view class="item-section">模型选择</view>
        <view class="model-content">
          <view class="model-item-list" v-for="(item,index) in models" :key="index">
            <view class="model-item" :class="item.selected?'model-sel':''" @click="clickModel(item,index)">
              <view class="model-item-txt huiyu-line">{{ item.model_name }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 尺寸比例 -->
      <view class="box-content ratio-box">
        <view class="item-section">尺寸比例</view>
        <view class="ratio-content">
          <view class="ratio-list" v-for="(item,index) in sizeRatios" :key="index">
            <view class="ratio-item" :class="item.selected?'ratio-sel':''" @click="clickRatioChange(item,index)">
              <view class="item-shape-box">
                <view class="item-shape" :style="'width:'+item.width+'px;height:'+item.height+'px;'"></view>
              </view>
              <view class="item-txt">{{ item.ratio }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 生成数量 -->
      <view class="box-content generate-box">
        <view class="item-section">生成数量</view>
        <view class="generate-content">
          <view class="generate-list" v-for="(item,index) in generates" :key="index">
            <view class="generate-item" :class="item.selected?'generate-sel':''" @click="clickGenerateChange(item,index)">{{ item.val }}张</view>
          </view>
        </view>
      </view>
      <!-- 图片质量 -->
      <view class="box-content quality-box">
        <view class="item-section">图片质量</view>
        <view class="quality-content">
          <view class="quality-list" v-for="(item,index) in qualitys" :key="index">
            <view class="quality-item" :class="item.selected?'quality-sel':''" @click="clickQualityChange(item,index)">{{ item.title }}</view>
          </view>
        </view>
      </view>
      <!-- 生成结果 -->
      <view class="box-content result-box" v-if="generatesImages && generatesImages.length>0">
        <view class="item-section">生成结果(点击图片长按保存)</view>
        <view class="result-content">
          <view class="res-img-box" v-for="(item,index) in generatesImages" :key="index" @click="clickImg(generatesImages,index)">
            <image :src="item" mode="aspectFit"></image>
            <view class="download" @click.stop="clickDown(item,index)">
              <text class="iconfont icon-xiazai"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提交 -->
      <view class="submit-box" @click="clickSubmit">
        <view class="submit-btn" v-if="generatesImages.length<=0">立即生成</view>
        <view class="submit-btn" v-else>再画一次</view>
      </view>

      <!-- 反向描述词 -->
      <view class="input-item">
        <view class="section">
          <view class="title">我不要</view>
          <view class="title-desc">(负向描述词)</view>
        </view>
        <view class="text-area">
          <textarea v-model="reverse" placeholder="输入你不想要的内容，短语单词为佳，支持中英文，用逗号分割。" :maxlength="maxinput"></textarea>
        </view>
        <view class="text-num-box">
          <view class="text-num">{{ reverse_num }}/{{ maxinput }}</view>
        </view>
      </view>
      <!-- 描述词相关度 -->
      <view class="box-content cueword-box">
        <view class="item-section">描述词相关度</view>
        <view class="slier">
          <slider :value="formData.cfg" min="3" max="15" @change="cuewordSliderChange" :show-value="true" active-color="#F8D849" block-color="#F8D849" block-size="20"></slider>
        </view>
      </view>
      <!-- 采样步数 -->
      <view class="box-content cueword-box">
        <view class="item-section">采样步数</view>
        <view class="slier">
          <slider :value="formData.steps" min="10" max="30" @change="sampleSliderChange" :show-value="true" active-color="#F8D849" block-color="#F8D849" block-size="20"></slider>
        </view>
      </view>
      <!-- 随机种子 -->
      <view class="box-content seed-box">
        <view class="item-section">随机种子
          <text class="item-section-subs">(选填)</text>
        </view>
        <input class="seed-input" v-model="seed_num" type="number" placeholder="请输入随机种子"/>
      </view>

      <view class="huiyu-safe20"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'pic-draw',
  props: {
    scrollHeight: {
      typeof: Number,
      default: 0
    }
  },
  data() {
    return {
      isBusying: false,
      samplerVal: 0,
      cueword: '',
      reverse: '',
      seed_num: '',
      formData: {
        modelId: 1,
        size: 1,
        prompt: "",
        negativePrompt: "",
        count: 1,
        cfg: 7,
        steps: 20,
        seed: -1,
      },
      maxinput: 500,
      cueword_num: 0,
      reverse_num: 0,
      models: [],
      sizeRatios: [
        {
          ratio: '1:1',
          width: 15,
          height: 15,
          val: 1,
          desc: '头像框',
          selected: true
        },
        {
          ratio: '3:4',
          width: 15,
          height: 20,
          val: 2,
          desc: '社交媒体',
          selected: false
        },
        {
          ratio: '4:3',
          width: 20,
          height: 15,
          val: 3,
          desc: '文章配图',
          selected: false
        },
        {
          ratio: '9:16',
          width: 15,
          height: 26,
          val: 4,
          desc: '手机壁纸',
          selected: false
        },
        {
          ratio: '16:9',
          width: 26,
          height: 15,
          val: 5,
          desc: '电脑壁纸',
          selected: false
        },
      ],
      generates: [
        {
          val: 1,
          selected: true,
        },
        {
          val: 2,
          selected: false,
        },
        {
          val: 3,
          selected: false,
        },
        {
          val: 4,
          selected: false,
        }
      ],
      qualitys: [
        {
          title: '普通',
          val: 1,
          selected: true,
        },
        {
          title: '高清',
          val: 2,
          selected: false,
        },
        {
          title: '超高清',
          val: 3,
          selected: false,
        },
        {
          title: '精绘',
          val: 4,
          selected: false,
        }
      ],
      generatesImages: [],
    }
  },
  watch: {
    cueword(n, o) {
      this.cueword_num = n.length;
    },
    reverse(n, o) {
      this.reverse_num = n.length;
    },
    "formData.steps": {
      immediate: true,
      handler(n, o) {
        this.formData.hr_second_pass_steps = n;
      }
    },
    seed_num: {
      immediate: true,
      handler(n, o) {
        if (n.length > 0) {
          this.formData.seed = n;
        } else {
          this.formData.seed = -1;
        }
      }
    }
  },
  mounted() {
    this.getSdModels();
  },
  methods: {
    /**
     * 获取模型
     */
    getSdModels() {

    },
    /**
     * 切换模型
     */
    clickModel(item, index) {
    },
    /**
     * 随机推荐词
     */
    recommendedWord() {

    },
    /**
     * 提示词相关性改变
     */
    cuewordSliderChange(e) {
      this.formData.cfg = e.detail.value;
    },
    /**
     * 采样迭代步数改变
     */
    sampleSliderChange(e) {
      this.formData.steps = e.detail.value;
    },
    /**
     * 采样比例改变
     */
    clickRatioChange(item, index) {
      this.sizeRatios.forEach((fItem, fIndex) => {
        fItem.selected = false;
      });
      item.selected = true;
    },
    /**
     * 生成数量改变
     */
    clickGenerateChange(item, index) {
      this.generates.forEach((fItem, fIndex) => {
        fItem.selected = false;
      });
      item.selected = true;
      this.formData.count = item.val;
    },
    /**
     * 图片质量选择
     */
    clickQualityChange(item, index) {
      this.qualitys.forEach((fItem, fIndex) => {
        fItem.selected = false;
      });
      item.selected = true;
    },
    /**
     * 开始生成
     */
    async clickSubmit() {
      if (!this.cueword && !this.reverse) {
        return this.$utils.showToast("请输入提示词或反向提示词")
      }

      if (this.isBusying) {
        return this.$utils.showToast("请稍后...")
      }

      this.formData.prompt = this.cueword + ",<lora:loraName:1.0>";
      // 反向提示语处理
      this.formData.negativePrompt = this.reverse + ",nsfw,jinpingxi,xijinping";

      this.isBusying = true;
      uni.showLoading({
        title: '正在生成...',
        mask: true
      });

    },
    /**
     * 预览
     */
    clickImg(urls, index) {
      wx.previewImage({
        urls: urls,
        current: index,
        success: function (res) {
        },
        fail: function (res) {
        },
        complate: function (res) {
        }
      })
    },
    /**
     * 下载
     */
    async clickDown(item, index) {

      if (this.isBusying) {
        return this.$utils.showToast("请稍后...")
      }
      this.isBusying = true;
      uni.showLoading({
        title: '图片解析中...',
        mask: true
      })
      let img_path = await this.$utils.base64ToPath(item);

      uni.hideLoading();
      this.isBusying = false;

      // #ifdef H5
      let aLink = document.createElement('a');
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = new Date().getTime() + '.png';
      aLink.href = img_path;
      aLink.click();
      // #endif

      // #ifndef H5
      uni.saveImageToPhotosAlbum({
        filePath: img_path, //不支持网络地址
        success: function () {
          uni.showToast({
            title: '保存成功',
          });
        },
        fail(err) {
          uni.showToast({
            title: '保存失败',
            icon: 'error'
          });
        }
      });
      // #endif
    },

  }
}
</script>

<style lang="scss">
.com-pic-draw {
  padding: 0rpx 30rpx;
}

.input-item {
  margin-top: 30rpx;
  background-color: #323232;
  padding: 20rpx;
  border-radius: 10rpx;

  .section {
    display: flex;
    align-items: baseline;
    font-size: 15px;
    color: $huiyu-color-main;

    .title {
      font-weight: bold;
      margin-right: 8rpx;
    }

    .title-desc {
      font-size: 10px;
    }
  }

  .text-area {
    textarea {
      width: 100%;
      height: 120px;
      font-size: 13px;
      padding: 15rpx 0;
    }
  }

  .text-num-box {
    display: flex;
    justify-content: flex-end;
    color: #969696;
  }
}

.recommended-word-box {
  padding: 26rpx 0 10rpx 10rpx;
  display: flex;

  .recommended-word {
    display: flex;
    align-items: center;
    font-size: 13px;
    border: 1rpx solid $huiyu-color-main;
    padding: 6rpx 12rpx;
    border-radius: 10rpx;
    color: $huiyu-color-main;

    text {
      margin-right: 5rpx;
    }
  }
}

.item-section {
  padding: 30rpx 0 10rpx;

  .item-section-subs {
    font-size: 13px;
    margin-left: 10rpx;
  }
}

.box-content {
  padding: 0 20rpx;
}

.model-box {
  .model-content {
    padding: 10rpx 10rpx 0;
    display: flex;
    flex-wrap: wrap;

    .model-item-list {
      width: calc(33% - 14rpx);
      height: 80rpx;
      margin: 0 20rpx 0rpx 0;

      &:nth-child(3n) {
        margin: 0;
      }

      .model-item {
        padding: 10rpx 15rpx;
        font-size: 14px;
        border-radius: 10rpx;
        background-color: #323232;
        box-sizing: border-box;
        width: 100%;
        border: 1px solid transparent;

        .model-item-txt {
          text-align: center;
        }
      }

      .model-sel {
        background-color: transparent;
        border: 1px solid $huiyu-color-main;
        color: $huiyu-color-main;
        box-sizing: border-box;
      }
    }
  }
}

.template-box {
  .template-content {
    padding: 10rpx 10rpx 0;
    display: flex;
    flex-wrap: wrap;

    .template-item-list {
      width: calc(33% - 14rpx);
      height: 160rpx;
      margin: 0 20rpx 0rpx 0;

      &:nth-child(3n) {
        margin: 0;
      }

      .template-item {
        font-size: 14px;
        border-radius: 10rpx;
        background-color: #323232;
        box-sizing: border-box;
        width: 100%;
        height: 140rpx;
        border: 1px solid transparent;
        overflow: hidden;

        .template-normal {
          width: 100%;
          height: 100%;
          position: relative;

          .img-box {
            width: 100%;
            height: 100%;
          }

          .template-item-txt {
            padding: 5rpx 10rpx;
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
          }
        }

        .template-no {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          .iconfont {
            font-size: 26px;
            color: #969696;
          }
        }
      }

      .template-sel {
        border: 1px solid $huiyu-color-main;
        color: $huiyu-color-main;
        box-sizing: border-box;
      }
    }
  }
}

.cueword-box {
}

.samplers-box {
}

.seed-box {
  .seed-input {
    height: 35px;
    font-size: 14px;
    padding: 0 20rpx;
    border: 1px solid #fff;
    border-radius: 4px;
  }
}

.ratio-box {
  .ratio-content {
    display: flex;
    flex-wrap: wrap;

    .ratio-list {
      width: calc(20% - 25rpx);
      margin: 20rpx 30rpx 0rpx 0;

      &:nth-child(5n) {
        margin-right: 0;
      }

      .ratio-item {
        padding: 5rpx 10rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10rpx;
        border: 1px solid #969696;

        .item-shape-box {
          width: 60rpx;
          height: 60rpx;
          display: flex;
          justify-content: center;
          align-items: center;

          .item-shape {
            background-color: #969696;
            border-radius: 5rpx;
          }
        }

        .item-txt {
          font-size: 13px;
        }
      }

      .ratio-sel {
        border: 1px solid $huiyu-color-main;
      }
    }
  }
}

.generate-box {
  .generate-content {
    display: flex;
    flex-wrap: wrap;

    .generate-list {
      width: calc(25% - 17rpx);
      margin-right: 20rpx;

      &:nth-child(4n) {
        margin-right: 0;
      }

      .generate-item {
        display: flex;
        justify-content: center;
        padding: 10rpx 0;
        background-color: #969696;
        border-radius: 10rpx;
        font-size: 14px;
      }

      .generate-sel {
        background-color: $huiyu-color-main;
      }
    }
  }
}

.quality-box {
  .quality-content {
    display: flex;
    flex-wrap: wrap;

    .quality-list {
      width: calc(25% - 17rpx);
      margin-right: 20rpx;

      &:nth-child(4n) {
        margin-right: 0;
      }

      .quality-item {
        display: flex;
        justify-content: center;
        padding: 10rpx 0;
        background-color: #969696;
        border-radius: 10rpx;
        font-size: 14px;
      }

      .quality-sel {
        background-color: $huiyu-color-main;
      }
    }
  }
}

.submit-box {
  display: flex;
  justify-content: center;
  margin: 80rpx 0;

  .submit-btn {
    width: 80%;
    padding: 20rpx 0;
    background-color: $huiyu-color-main;
    color: #323232;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
  }
}

.result-box {
  margin-top: 30rpx;

  .result-content {
    display: flex;
    flex-wrap: wrap;

    .res-img-box {
      width: calc(50% - 12rpx);
      height: 150px;
      margin: 20rpx 20rpx 0 0;

      &:nth-child(2n) {
        margin-right: 0;
      }

      background-color: rgba(150, 150, 150, 0.8);
      border-radius: 10rpx;
      position: relative;

      .download {
        position: absolute;
        right: 0rpx;
        bottom: 0;
        padding: 50rpx 18rpx 20rpx 40rpx;

        // background-color: #fff000;
        text {
          background-color: rgba(0, 0, 0, 0.6);
          padding: 13rpx;
          border-radius: 100px;
        }
      }
    }
  }

}

::v-deep uni-slider {
  margin: 10px 2px !important;
}

::v-deep uni-slider .uni-slider-value {
  width: auto !important;
  margin-left: 20rpx !important;
  // text-align: right;
  min-width: 20px;
}

/deep/ .uni-select__selector {
  background-color: #323232 !important;
  border: 1px solid #969696 !important;
}

::v-deep .uni-select .uni-popper__arrow {
  border-bottom-color: #969696 !important;
}

::v-deep .uni-select .uni-popper__arrow::after {
  border-bottom-color: #969696 !important;
}

::v-deep .uni-select .uni-select__input-text {
  color: #fff;
}

::v-deep .uni-select .uni-select__input-placeholder {
  color: #6a6a6a !important;
}
</style>
