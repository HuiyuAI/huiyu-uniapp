import axios from '@/util/request'

const oauthClient = {
  client_id: 'wechat',
  client_secret: '123456',
}

export function login(data) {
  return axios({
    url: '/auth/oauth/token',
    method: 'POST',
    params: {
      ...oauthClient,
      grant_type: 'wechat',
      ...data,
    },
  })
}

export function refreshToken(rt) {
  return axios({
    url: '/auth/oauth/token',
    method: 'POST',
    params: {
      ...oauthClient,
      grant_type: 'refresh_token',
      refresh_token: rt
    },
  })
}
