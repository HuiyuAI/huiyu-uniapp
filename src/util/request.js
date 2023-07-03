import axios from 'axios'
import {BASE_SERVER_URL} from "@/config";
import {refreshToken} from "@/api/login";
import {isRefreshTokenExpires, isTimeToRefreshToken, parseJwtPayload2Obj} from "@/util/jwtUtils";

// axios 对 uni-app 的适配器
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    const settle = require('axios/lib/core/settle')
    const buildURL = require('axios/lib/helpers/buildURL')
    uni.request({
      method: config.method.toUpperCase(),
      url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete(response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config
        }
        settle(resolve, reject, response)
      }
    })
  })
}

//是否有请求正在刷新token
let isRefreshing = false
//被挂起的请求队列
let refreshSubscribers = []

//将请求加入队列
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

//队列中的请求在刷新token完毕后，用新的token去请求数据
function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token))
}

function logout() {
  //release
  isRefreshing = false
  refreshSubscribers = []
  uni.clearStorageSync()
  uni.showToast({
    title: '登录状态已失效，请重新登录',
    icon: 'none'
  })
}

const request = axios.create({
  baseURL: BASE_SERVER_URL,
  timeout: 5000
})

// request interceptor
request.interceptors.request.use(config => {
      const token = uni.getStorageSync('access_token')
      if (token) {
        //检查refresh_token是否过期
        if (isRefreshTokenExpires()) {
          logout()
          return Promise.reject()
        }

        //检查是否需要刷新access_token
        if (config.url.indexOf('/auth/oauth/token') === -1 && (isRefreshing || isTimeToRefreshToken())) {
          if (!isRefreshing) {
            //lock
            isRefreshing = true
            //刷新token
            refreshToken(uni.getStorageSync('refresh_token')).then(res => {
              const userInfo = (
                  ({userId, openid, nickname, avatar}) => ({userId, openid, nickname, avatar})
              )(res)
              uni.setStorageSync('userInfo', userInfo)
              uni.setStorageSync('access_token', res.access_token)
              uni.setStorageSync('refresh_token', res.refresh_token)
              //access_token到期时间
              uni.setStorageSync('access_token_expires_at', ~~(Date.now() / 1000) + res.expires_in)
              //refresh_token到期时间
              const refreshTokenPayload = parseJwtPayload2Obj(res.refresh_token)
              uni.setStorageSync('refresh_token_expires_at', refreshTokenPayload.exp)

              //release
              isRefreshing = false
              //调用所有挂起的请求
              onRefreshed(res.access_token)
              refreshSubscribers = []
            }).catch(err => {
              logout()
              return Promise.reject(err)
            })
          }
          //挂起请求
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              config.headers['Authorization'] = `Bearer ${token}`
              resolve(config)
            })
          })
        }
        //正常执行请求
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
)

// response interceptor
request.interceptors.response.use(response => {
      const res = response.data
      if (res.code !== 200) {
        const msg = res.msg || 'Error'
        uni.showToast({
          title: msg,
          icon: 'none'
        })
        return Promise.reject(new Error(msg))
      }
      return res.data
    },
    error => {
      uni.showToast({
        title: error.message,
        icon: 'none'
      })
      return Promise.reject(error)
    }
)

export default request
