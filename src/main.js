import Vue from 'vue'
import App from './App'

import uView from "uview-ui";

Vue.use(uView)

import './uni.promisify.adaptor'

import store from './store'
import utils from "./util/utils.js"

Vue.prototype.$utils = utils;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})

app.$mount()
