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
