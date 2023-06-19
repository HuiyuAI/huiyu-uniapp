import axios from '@/util/request'

export function getUserInfo(userId) {
  return axios({
    url: `/user/user/info/${userId}`,
    method: 'GET',
  })
}

export function getUserDesc(userId) {
  return axios({
    url: `/user/user/desc/${userId}`,
    method: 'GET',
  })
}
