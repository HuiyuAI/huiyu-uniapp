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
