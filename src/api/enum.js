import axios from '@/util/request'

export function getPointOperationSourceEnum() {
  return axios({
    url: `/service/admin/enum/getPointOperationSourceEnum`,
    method: 'GET',
  })
}
