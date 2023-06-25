<template>
  <view class="container">
    <view class="wrap">
      <u-waterfall v-model="flowList" ref="uWaterfall">
        <template v-slot:left="{leftList}">
          <view class="demo-warter" v-for="(item, index) in leftList" :key="index">
            <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
          </view>
        </template>
        <template v-slot:right="{rightList}">
          <view class="demo-warter" v-for="(item, index) in rightList" :key="index">
            <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
          </view>
        </template>
      </u-waterfall>
      <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
    </view>
  </view>
</template>

<script>
export default {
  name: "pic",
  data() {
    return {
      loadStatus: 'loadmore',
      flowList: [],
      list: [
        {
          image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg',
        },
        {
          image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg',
        },
        {
          image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
        },
        {
          image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/zzpic23369_s.jpg',
        },
      ]
    }
  },
  created() {
    this.addRandomData()
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
    this.loadStatus = 'loading';
    // 模拟数据加载
    setTimeout(() => {
      this.addRandomData();
      this.loadStatus = 'loadmore';
    }, 1000)
  },
  methods: {
    addRandomData() {
      for (let i = 0; i < 10; i++) {
        let index = this.$u.random(0, this.list.length - 1);
        // 先转成字符串再转成对象，避免数组对象引用导致数据混乱
        let item = JSON.parse(JSON.stringify(this.list[index]))
        item.id = this.$u.guid();
        this.flowList.push(item);
      }
    },
  }
}
</script>

<style scoped lang="scss">
.demo-warter {
  border-radius: 8px;
  margin: 5px;
  background-color: #ffffff;
  padding: 8px;
  position: relative;
}

.demo-image {
  width: 100%;
  border-radius: 4px;
}
</style>
