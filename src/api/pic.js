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

export function getPicSharePage(pageNum, pageSize, queryDeadline) {
  return axios({
    url: '/service/pic/picSharePage',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      queryDeadline,
    }
  })
}

export function getPicShare(uuid) {
  return axios({
    url: '/service/pic/getPicShare',
    method: 'GET',
    params: {
      uuid
    }
  })
}

export function redraw(uuid) {
  return axios({
    url: '/service/pic/redraw',
    method: 'GET',
    params: {
      uuid
    }
  })
}
