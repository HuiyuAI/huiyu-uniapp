import axios from '@/util/request'

export function getMyUserInfo() {
  return axios({
    url: `/service/user/getMyUserInfo`,
    method: 'GET',
  })
}
