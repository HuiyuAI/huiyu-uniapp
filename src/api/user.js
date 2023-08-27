import axios from '@/util/request'

export function getMyUserInfo() {
  return axios({
    url: `/service/user/getMyUserInfo`,
    method: 'GET',
  })
}

export function pagePointRecord(pageNum, pageSize) {
  return axios({
    url: `/service/user/pagePointRecord`,
    method: 'GET',
    params: {
      pageNum,
      pageSize,
    }
  })
}

export function updateNickname(nickname) {
  return axios({
    url: `/service/user/updateNickname`,
    method: 'POST',
    params: {
      nickname
    }
  })
}
