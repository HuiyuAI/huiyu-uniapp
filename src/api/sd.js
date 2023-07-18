import axios from "@/util/request";

export function getModelList() {
  return axios({
    url: '/service/model/list',
    method: 'GET',
  })
}

export function txt2img(data) {
  return axios({
    url: '/service/sd/txt2img',
    method: 'POST',
    data: {
      ...data
    }
  })
}

export function restoreFace(data) {
  return axios({
    url: '/service/sd/restoreFace',
    method: 'POST',
    data: {
      ...data
    }
  })
}
