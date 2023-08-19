import axios from "@/util/request";

export function getPicPage(pageNum, pageSize, queryDeadline) {
  return axios({
    url: '/service/pic/page',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      queryDeadline,
    }
  })
}

export function getPicDetail(uuid) {
  return axios({
    url: '/service/pic/get',
    method: 'GET',
    params: {
      uuid
    }
  })
}

export function deleteByUuidList(uuidList) {
  return axios({
    url: '/service/pic/deleteByUuidList',
    method: 'POST',
    data: uuidList
  })
}

export function share(uuid, title) {
  return axios({
    url: '/service/pic/share',
    method: 'POST',
    data: {
      uuid,
      title
    }
  })
}
