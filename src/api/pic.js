import axios from "@/util/request";

export function getPicPage(pageNum, pageSize, queryDeadline) {
  return axios({
    url: '/pic/page',
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
    url: '/pic/get',
    method: 'GET',
    params: {
      uuid
    }
  })
}
