// 引入全局mixin
import mixin from './libs/mixin/mixin.js'
// 小程序特有的mixin
import mpMixin from './libs/mixin/mpMixin.js'

// 公共工具函数
import * as index from './libs/function/index.js'
// 规则检验
import * as test from './libs/function/test.js'


const $uv = {
  test,
  ...index,
  mixin,
  mpMixin
}
uni.$uv = $uv;
const install = (Vue, options = {}) => {
  // #ifndef APP-NVUE
  Vue.mixin(mixin);
  // #endif
  // #ifdef VUE2
  // 同时挂载到uni和Vue.prototype中
  // #ifndef APP-NVUE
  // 只有vue，挂载到Vue.prototype才有意义，因为nvue中全局Vue.prototype和Vue.mixin是无效的
  Vue.prototype.$uv = $uv;
  // #endif
  // #endif
  // #ifdef VUE3
  Vue.config.globalProperties.$uv = $uv;
  // #endif
}
export default {
  install
}
