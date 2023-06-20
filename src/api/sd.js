import axios from "@/util/request";

export function getModelList(data) {
  return axios({
    url: '/model/list',
    method: 'GET',
  })
}
