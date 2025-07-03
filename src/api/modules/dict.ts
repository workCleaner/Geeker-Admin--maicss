import http from '@/api'
import { SERVER_ENDPOINTS } from '@/constants'
import { treeMap } from '@/utils'

/**
 * 字典
 */

export interface Dict {
  code: string
  name: string
  parentId: number
  id: number
  children?: (this & { type: string })[]
  remark?: string
  status?: 0 | 1
  type?: string
  value?: string
  label?: string
}

export interface DictQuery extends RequestPage {
  code?: string
  name?: string
}

const DictAPI = {
  getDictList: (params: DictQuery): Promise<ResultPage<Dict>> => {
    return http.get<ResultPage<any>>(SERVER_ENDPOINTS.api + `/dict/page`, params).then(res => {
      return {
        list: res.list.map(node =>
          treeMap(node, item => ({ code: item.value, name: item.label, remark: item.type, ...item }))
        ),
        total: res.total,
      }
    })
  },

  add() {},
  edit() {},
}

export default DictAPI
