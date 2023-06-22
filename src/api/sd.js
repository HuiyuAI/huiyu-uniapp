import axios from "@/util/request";

export function getModelList(data) {
  return axios({
    url: '/model/list',
    method: 'GET',
  })
}

export function txt2img(data) {
  return axios({
    url: '/sd/txt2img',
    method: 'POST',
    data: {
      ...data
    }
  })
}
