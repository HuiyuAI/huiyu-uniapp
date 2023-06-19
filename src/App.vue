<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>

<script>
export default {
  onLaunch: function () {
    console.log('App Launch')

    // uni.login({
    //   provider: 'weixin',
    //   success: function (loginRes) {
    //     uni.request({
    //       url: '',
    //       success: (res) => {
    //         console.log(res);
    //       }
    //     });
    //   }
    // });
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
@import "static/css/base.scss";
@import "static/font/iconfont.css";

::v-deep .uni-toast {
  background-color: #fff !important;
}

::v-deep .uni-toast-text {
  color: #323232 !important;
}

::v-deep .uni-toast__content {
  color: #323232 !important;
}

::v-deep .uni-sample-toast {
  background-color: #fff !important;
  border-radius: 10rpx !important;
}

::v-deep .uni-simple-toast__text {
  background-color: #fff !important;
  color: #323232 !important;
}
</style>
