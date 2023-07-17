<template>
  <view class="container">
    <scroll-view scroll-y="true">
      <!-- 正向描述词 -->
      <view class="input-item" style="margin-top: 0">
        <view class="section">
          <view class="title">画面描述</view>
          <view class="title-desc">(建议以推荐词为基础修改)</view>
        </view>
        <view class="text-area">
          <textarea v-model="formData.prompt" :show-confirm-bar="false" :maxlength="maxInput"
                    placeholder="输入你想要的内容，短语单词为佳，支持中英文，用逗号分割。"></textarea>
        </view>
        <view class="text-num-box">
          <view>{{ promptNum }}/{{ maxInput }}</view>
        </view>
      </view>
      <view class="recommended-word-box">
        <!-- 节流 -->
        <view class="recommended-word" @click="$u.throttle(recommendedWord, 1000)">
          试试推荐词
          <text class="iconfont icon-shuaxin"></text>
        </view>
      </view>
      <!-- 模型选择 -->
      <view class="model-box">
        <view class="item-section">模型选择</view>
        <view class="model-content">
          <view class="model-item-list" v-for="(item,index) in modelList" :key="index">
            <view class="model-item" :class="item.selected?'model-sel':''" @click="clickModel(item)">
              <view class="model-normal">
                <view class="img-box">
                  <image :src="item.coverUrl" mode="aspectFill"></image>
                </view>
                <view class="model-item-txt huiyu-line">{{ item.name }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 尺寸比例 -->
      <view class="ratio-box">
        <view class="item-section">尺寸比例</view>
        <view class="ratio-content">
          <view class="ratio-list" v-for="(item,index) in sizeList" :key="index">
            <view class="ratio-item" :class="item.selected?'ratio-sel':''" @click="sizeChange(item)">
              <view class="item-shape-box">
                <view class="item-shape" :style="'width:'+item.width+'px;height:'+item.height+'px;'"></view>
              </view>
              <view class="item-txt">{{ item.ratio }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 生成数量 -->
      <view class="generate-box">
        <view class="item-section">生成数量</view>
        <view class="generate-content">
          <view class="generate-list" v-for="(item,index) in countList" :key="index">
            <view class="generate-item" :class="item.selected?'generate-sel':''" @click="countChange(item)">{{ item.val }}张</view>
          </view>
        </view>
      </view>
      <!-- 图片质量 -->
      <view class="quality-box">
        <view class="item-section">图片质量</view>
        <view class="quality-content">
          <view class="quality-list" v-for="(item,index) in qualityList" :key="index">
            <view class="quality-item" :class="item.selected?'quality-sel':''" @click="qualityChange(item)">{{ item.title }}</view>
          </view>
        </view>
      </view>

      <!-- 高级设置 -->
      <view class="action-box">
        <view class="left">高级设置</view>
        <view class="right">
          <u-switch v-model="enableAdvanced" size="40" active-color="#2979ff" inactive-color="#555555"></u-switch>
        </view>
      </view>

      <view v-if="enableAdvanced">
        <!-- 反向描述词 -->
        <view class="input-item">
          <view class="section">
            <view class="title">我不要</view>
            <view class="title-desc">(负向描述词)</view>
          </view>
          <view class="text-area">
            <textarea v-model="formData.negativePrompt" :show-confirm-bar="false" :maxlength="maxInput"
                      placeholder="输入你不想要的内容，短语单词为佳，支持中英文，用逗号分割。"></textarea>
          </view>
          <view class="text-num-box">
            <view>{{ negativePromptNum }}/{{ maxInput }}</view>
          </view>
        </view>
        <!-- 描述词相关度 -->
        <view>
          <view class="item-section">描述词相关度</view>
          <slider :value="formData.cfg" min="3" max="15" @change="cfgChange" :show-value="true" active-color="#2979ff" block-color="#2979ff" block-size="20"></slider>
        </view>
        <!-- 采样步数 -->
        <view>
          <view class="item-section">采样步数</view>
          <slider :value="formData.steps" min="10" max="30" @change="stepsChange" :show-value="true" active-color="#2979ff" block-color="#2979ff" block-size="20"></slider>
        </view>
        <!-- 随机种子 -->
        <view class="seed-box">
          <view class="item-section">随机种子
            <text class="item-section-subs">(选填)</text>
          </view>
          <input class="seed-input" v-model="seed" type="number" maxlength="10" @input="seedInput" placeholder="请输入随机种子"/>
        </view>
      </view>

      <!-- 提交 节流 -->
      <view class="submit-box" @click="$u.throttle(clickSubmit, 2000)">
        <button>立即生成（消耗{{ point }}积分）</button>
      </view>

      <view class="safe-area"></view>
    </scroll-view>

    <u-toast ref="uToast"/>
  </view>
</template>

<script>
import {getModelList, txt2img} from "@/api/sd";

export default {
  name: 'Draw',
  data() {
    return {
      formData: {
        modelId: 1,
        prompt: '',
        negativePrompt: '',
        steps: 20,
        size: 1,
        count: 1,
        quality: 1,
        cfg: 9,
        seed: null,
      },
      point: 2,
      isBusying: false,
      modelList: [],
      promptNum: 0,
      negativePromptNum: 0,
      maxInput: 500,
      enableAdvanced: false,
      seed: null,
      sizeList: [
        {ratio: '9:16', width: 15, height: 26, val: 1, desc: '手机壁纸', selected: true},
        {ratio: '16:9', width: 26, height: 15, val: 2, desc: '电脑壁纸', selected: false},
        {ratio: '3:2', width: 22, height: 15, val: 4, desc: '文章配图', selected: false},
        {ratio: '2:3', width: 15, height: 22, val: 3, desc: '社交媒体', selected: false},
        {ratio: '1:1', width: 20, height: 20, val: 5, desc: '头像', selected: false},
      ],
      countList: [
        {val: 1, selected: true},
        {val: 2, selected: false},
        {val: 3, selected: false},
        {val: 4, selected: false},
      ],
      qualityList: [
        {title: '高清', val: 1, selected: true},
        {title: '超清', val: 2, selected: false},
        {title: '超高清4K', val: 3, selected: false},
      ],
    }
  },
  watch: {
    'formData.prompt'(n, o) {
      this.promptNum = n.length
    },
    'formData.negativePrompt'(n, o) {
      this.negativePromptNum = n.length
    },
  },
  created() {
    this.getModelList()
  },
  methods: {
    /**
     * 获取模型
     */
    getModelList() {
      getModelList().then(res => {
        this.modelList = res
        // 按照priority从小到大排序
        this.modelList.sort((a, b) => {
          return a.priority - b.priority
        })
        this.modelList.forEach((item, index) => {
          if (index === 0) {
            item.selected = true
          } else {
            item.selected = false
          }
        })
      })
    },
    /**
     * 切换模型
     */
    clickModel(item) {
      this.modelList.forEach((fItem) => {
        fItem.selected = false
      })
      item.selected = true
      this.formData.modelId = item.id
    },
    /**
     * 随机推荐词
     */
    recommendedWord() {
      this.formData.prompt = this.$u.guid() + ',masterpiece,best quality,official art,extremely detailed CG unity 8k wallpaper, illustration, landscape, 1girl, solo, standing, long hair, from behind, outdoors, day, blue sky, cloud, plant, inverted reflection in water, rainbow, house, scenery, utility pole, power lines, summer, railing, cumulonimbus cloud, octans'
    },
    /**
     * 尺寸比例改变
     */
    sizeChange(item) {
      this.sizeList.forEach((fItem) => {
        fItem.selected = false
      })
      item.selected = true
      this.formData.size = item.val
    },
    /**
     * 生成数量改变
     */
    countChange(item) {
      this.countList.forEach((fItem) => {
        fItem.selected = false
      })
      item.selected = true
      this.formData.count = item.val
    },
    /**
     * 图片质量选择
     */
    qualityChange(item) {
      this.qualityList.forEach((fItem) => {
        fItem.selected = false
      })
      item.selected = true
      this.formData.quality = item.val
    },
    /**
     * 描述词相关度改变
     */
    cfgChange(e) {
      this.formData.cfg = e.detail.value
    },
    /**
     * 采样步数改变
     */
    stepsChange(e) {
      this.formData.steps = e.detail.value
    },
    seedInput(e) {
      // 只允许输入正整数
      const value = e.target.value
      const isValid = /^[1-9]\d*$/.test(value)
      if (!value || isValid) {
        this.formData.seed = value
      } else {
        this.$nextTick(() => {
          this.seed = this.formData.seed
        })
      }
    },
    /**
     * 开始生成
     */
    clickSubmit() {
      if (!this.formData.prompt) {
        this.$refs.uToast.show({
          title: '请输入画面描述',
          type: 'default',
        })
        return
      }

      uni.showLoading({
        title: '正在提交任务中...',
        mask: true
      });

      txt2img(this.formData).then(res => {
        console.log(res)
      }).finally(() => {
        setTimeout(() => {
          uni.hideLoading()
        }, 2000)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0rpx 20rpx;
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
      font-size: 14px;
      line-height: 1.5;
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
    font-size: 12px;
    border: 1rpx solid $huiyu-color-main;
    padding: 6rpx 4rpx 6rpx 12rpx;
    border-radius: 10rpx;
    color: $huiyu-color-main;
  }
}

.item-section {
  padding: 30rpx 0 10rpx;

  .item-section-subs {
    font-size: 13px;
    margin-left: 10rpx;
  }
}

.model-box {
  .model-content {
    padding: 10rpx 10rpx 0;
    display: flex;
    flex-wrap: wrap;

    .model-item-list {
      width: calc(33% - 14rpx);
      height: 160rpx;
      margin: 0 20rpx 0rpx 0;

      &:nth-child(3n) {
        margin: 0;
      }

      .model-item {
        font-size: 14px;
        border-radius: 10rpx;
        background-color: #323232;
        box-sizing: border-box;
        width: 100%;
        height: 140rpx;
        border: 2px solid transparent;
        overflow: hidden;

        .model-normal {
          width: 100%;
          height: 100%;
          position: relative;

          .img-box {
            width: 100%;
            height: 100%;
          }

          .model-item-txt {
            padding: 5rpx 10rpx;
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
      }

      .model-sel {
        border: 2px solid $huiyu-color-main;
        color: $huiyu-color-main;
        box-sizing: border-box;
      }
    }
  }
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
        border: 2px solid $huiyu-color-normal;

        .item-shape-box {
          width: 60rpx;
          height: 60rpx;
          display: flex;
          justify-content: center;
          align-items: center;

          .item-shape {
            background-color: $huiyu-color-normal;
            border-radius: 5rpx;
          }
        }

        .item-txt {
          font-size: 13px;
        }
      }

      .ratio-sel {
        border: 2px solid $huiyu-color-main;
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
        background-color: $huiyu-color-normal;
        border-radius: 10rpx;
        font-size: 14px;
      }

      .generate-sel {
        color: black;
        font-weight: bold;
        background: $huiyu-color-button;
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
        background-color: $huiyu-color-normal;
        border-radius: 10rpx;
        font-size: 14px;
      }

      .quality-sel {
        color: black;
        font-weight: bold;
        background: $huiyu-color-button;
      }
    }
  }
}

.action-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 0 10rpx;

  .left {
    font-size: 20px;
  }

  .right {
    display: flex;
    margin-right: 10rpx;
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

.submit-box {
  z-index: 10;
  width: 70%;
  position: fixed;
  bottom: 20rpx;
  left: 15%;
  text-align: center;
  border-radius: 100rpx;
  box-shadow: 0 0 3px 3px rgba(72, 219, 251, 0.3), 0 0 5px 5px rgba(72, 219, 251, 0.3);

  button {
    background: $huiyu-color-button;
    color: black;
    border-radius: 100rpx;
    font-size: 30rpx;
    font-weight: bold;
  }
}

.safe-area {
  padding-bottom: 150rpx;
  padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
}
</style>
