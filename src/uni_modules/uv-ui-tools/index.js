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
  date: index.timeFormat, // 另名date
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
  // 时间格式化，同时两个名称，date和timeFormat
  Vue.filter('timeFormat', (timestamp, format) => uni.$uv.timeFormat(timestamp, format));
  Vue.filter('date', (timestamp, format) => uni.$uv.timeFormat(timestamp, format));
  // 将多久以前的方法，注入到全局过滤器
  Vue.filter('timeFrom', (timestamp, format) => uni.$uv.timeFrom(timestamp, format));
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
