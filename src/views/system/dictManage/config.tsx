import type { ProTableProps } from '@/components/ProTable/interface'
import type { Dict, DictQuery } from '@/api/modules/dict'
import DictAPI from '@/api/modules/dict'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { TABLE_COLUMN_OPERATION_NAME } from '@/constants'

// eslint-disable-next-line no-unused-vars
export const getConfig = ({ openDrawer, deleteDict }: any): ProTableProps<DictQuery, Dict> => {
  return {
    pageAuthId: 'system:dict',
    columns: [
      {
        prop: 'name',
        search: { el: 'input' },
        label: '字典名称',
        width: 150,
        align: 'left',
      },
      {
        prop: 'code',
        search: { el: 'input' },
        label: '字典编码',
      },
      {
        prop: 'remark',
        label: '备注',
      },
      {
        prop: 'status',
        label: '状态',
        width: 90,
        render: scope => {
          if (scope.row.parentId === 0) return '-'
          return <ElTag type={scope.row.type as any}>{scope.row.status === 1 ? '启用' : '禁用'}</ElTag>
        },
      },
      {
        prop: TABLE_COLUMN_OPERATION_NAME,
        width: 200,
        fixed: 'right',
        render: scope => {
          return (
            <ElButton type="primary" link onClick={() => ElMessage.success('tsx button')}>
              operation of {scope.row.code}
            </ElButton>
          )
        },
      },
    ],
    initParam: {
      name: 'aa',
    },
    requestApi: DictAPI.getDictList,
    pagination: true,
    toolButton: ['refresh', 'setting', 'search'],
    rowKey: 'id',
    searchCol: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
    title: '字典管理',
  }
}
