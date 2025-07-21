import { UserAPI } from '@/api/system/user'
import type { ProTableProps } from '@/components/ProTable/interface'
import { View, EditPen, Refresh, Delete } from '@element-plus/icons-vue'
import { TABLE_COLUMN_OPERATIONS_NAME } from '@/constants/proTable'
import { genderType } from '@/utils/dict'
import { userStatus } from '@/utils/dict'
import { ElButton } from 'element-plus'

export function getConfig({
  openDrawer,
  resetPass,
  deleteAccount,
}: {
  [k: string]: (..._args: any[]) => void
}): ProTableProps {
  return {
    requestApi: UserAPI.getUserList,
    requestAuto: true,
    // highlightCurrentRow: true,
    toolbarLeft: [
      'add',
      {
        auth: 'select',
        type: 'primary',
        icon: 'Pointer',
        name: 'select',
        text: '选中第四行',
      },
    ],
    toolbarRight: ['export', 'layout'],
    columns: [
      { type: 'radio', label: '单选', width: 80 },
      { type: 'index', label: '#', width: 80 },
      { prop: 'username', label: '用户姓名', width: 120 },
      { prop: 'gender', label: '性别', width: 120, sortable: true, enum: genderType },
      { prop: 'idCard', label: '身份证号' },
      { prop: 'email', label: '邮箱' },
      { prop: 'address', label: '居住地址' },
      { prop: 'status', label: '用户状态', width: 120, sortable: true, tag: true, enum: userStatus },
      { prop: 'createTime', label: '创建时间', width: 180, sortable: true },
      {
        prop: TABLE_COLUMN_OPERATIONS_NAME,
        label: '操作',
        width: 330,
        fixed: 'right',
        render(scope) {
          return (
            <>
              <ElButton type="primary" link={true} icon={View} onClick={() => openDrawer('查看', scope.row)}>
                查看
              </ElButton>
              <ElButton type="primary" link={true} icon={EditPen} onClick={() => openDrawer('编辑', scope.row)}>
                编辑
              </ElButton>
              <ElButton type="primary" link={true} icon={Refresh} onClick={() => resetPass(scope.row)}>
                重置密码
              </ElButton>
              <ElButton type="primary" link={true} icon={Delete} onClick={() => deleteAccount(scope.row)}>
                删除
              </ElButton>
            </>
          )
        },
      },
    ],
  }
}
