import http from '@/utils/request'
import { SERVER_ENDPOINTS } from '@/constants'
import { treeMap } from '@/utils'

export interface Dict {
  type?: string
  value: string | number
  label: string
  code: string
  name: string
}

export interface DictListItem extends Dict {
  parentId: number
  id: number
  children?: (this & { type: string })[]
  remark?: string
  status?: 0 | 1
}

export interface DictQuery extends RequestPage {
  code?: string
  name?: string
}

export const DictAPI = {
  // 分页获取字典列表
  getDictList: (params: DictQuery): Promise<ResultPage<DictListItem>> => {
    return http.get<ResultPage<any>>(SERVER_ENDPOINTS.api + `/dict/page`, params).then(res => {
      return {
        list: res.list.map(node =>
          treeMap(node, item => ({ code: item.value, name: item.label, remark: item.type, ...item }))
        ),
        total: res.total,
      }
    })
  },

  // 获取所有字典列表
  getAllDict: () => {
    return http.get<Record<string, Dict[]>>(SERVER_ENDPOINTS.api + `/dict/all`).then(res => {
      return res.list
    })
  },
  // 获取字典数据
  getDictData: (code: string) => http.get<Dict[]>(`${SERVER_ENDPOINTS.api}/dict/item/${code}`),

  add() {},
  edit() {},
}
