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

export function getDailyTaskPoint() {
  return axios({
    url: `/service/user/getDailyTaskPoint`,
    method: 'GET',
  })
}

export function bindInviter(sharerUserId) {
  return axios({
    url: `/service/user/bindInviter`,
    method: 'POST',
    params: {
      sharerUserId
    }
  })
}
