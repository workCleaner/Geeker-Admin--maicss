<template>
  <div class="main-box">
    <tree-filter
      title="部门列表(多选)"
      multiple
      label="name"
      :request-api="UserAPI.getUserDepartment"
      :default-value="treeFilterValues.departmentId"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <div class="card mb-2.5 pt-0 pb-0">
        <select-filter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
      </div>
      <pro-table
        ref="proTableRef"
        highlight-current-row
        :columns="columns"
        :request-api="UserAPI.getUserList"
        :init-param="Object.assign(treeFilterValues, selectFilterValues)"
      >
        <!-- 表格 header 按钮 -->
        <template #toolbarLeft>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')"> 新增用户 </el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd"> 批量添加用户 </el-button>
          <el-button type="primary" :icon="Pointer" plain @click="setCurrent"> 选中第四行 </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)"> 查看 </el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
          <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)"> 重置密码 </el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"> 删除 </el-button>
        </template>
      </pro-table>
      <user-drawer ref="drawerRef" />
      <import-excel ref="dialogRef" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'UseSelectFilter' })
import { ref, reactive, onMounted, watch, computed } from 'vue'
import type { ResUserList } from '@/api/system/user'
import { ElMessage } from 'element-plus'
import { useHandleData } from '@/hooks/useHandleData'
import { genderType, userStatus } from '@/utils/dict'
import TreeFilter from '@/components/TreeFilter/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import UserDrawer from '@/views/proTable/components/UserDrawer.vue'
import SelectFilter from '@/components/SelectFilter/index.vue'
import type { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { CirclePlus, Delete, EditPen, Pointer, Upload, View, Refresh } from '@element-plus/icons-vue'
import { UserAPI } from '@/api/system/user'
import { useI18n } from 'vue-i18n'

// ProTable 实例
const proTableRef = ref<ProTableInstance>()

const { t } = useI18n()

// 表格配置项
const columns = ref<ColumnProps<ResUserList>[]>([
  { type: 'radio', label: computed(() => t('common.radio')), width: 80 },
  { type: 'index', label: computed(() => t('common.index')), width: 80 },
  { prop: 'username', label: computed(() => t('common.username')), width: 120 },
  { prop: 'gender', label: computed(() => t('common.gender')), width: 120, sortable: true, enum: genderType },
  { prop: 'idCard', label: computed(() => t('common.idCard')) },
  { prop: 'email', label: computed(() => t('common.email')) },
  { prop: 'address', label: computed(() => t('common.address')) },
  {
    prop: 'status',
    label: computed(() => t('common.userStatus')),
    width: 120,
    sortable: true,
    tag: true,
    enum: userStatus,
  },
  { prop: 'createTime', label: computed(() => t('common.createTime')), width: 180, sortable: true },
  { prop: 'operation', label: computed(() => t('common.operation')), width: 330, fixed: 'right' },
])

// selectFilter 数据（用户角色为后台数据）
const selectFilterData = reactive([
  {
    title: '用户状态(单)',
    key: 'userStatus',
    options: [
      { label: '全部', value: '' },
      { label: '在职', value: '1', icon: 'User' },
      { label: '待培训', value: '2', icon: 'Bell' },
      { label: '待上岗', value: '3', icon: 'Clock' },
      { label: '已离职', value: '4', icon: 'CircleClose' },
      { label: '已退休', value: '5', icon: 'CircleCheck' },
    ],
  },
  {
    title: '用户角色(多)',
    key: 'userRole',
    multiple: true,
    options: [],
  },
])

// 获取用户角色字典
onMounted(() => {
  getUserRoleDict()
})
const getUserRoleDict = async () => {
  const data = await UserAPI.getUserRole()
  selectFilterData[1].options = data as any
}

// 默认 selectFilter 参数
const selectFilterValues = ref({ userStatus: '2', userRole: ['1', '3'] })
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  ElMessage.success('请注意查看请求参数变化 🤔')
  proTableRef.value!.pageable.pageNum = 1
  selectFilterValues.value = value
}

// 默认 treeFilter 参数
const treeFilterValues = reactive({ departmentId: ['11'] })
const changeTreeFilter = (val: string[]) => {
  ElMessage.success('请注意查看请求参数变化 🤔')
  proTableRef.value!.pageable.pageNum = 1
  treeFilterValues.departmentId = val
}

// const toolbarClick = ({ name, payload }: { name: string; payload?: any }) => {
//   if (name === 'select') {
//     proTableRef.value!.radio = proTableRef.value?.tableData[3].id
//     proTableRef.value?.element?.setCurrentRow(proTableRef.value?.tableData[3])
//   }
// }

// 选择行
const setCurrent = () => {
  proTableRef.value!.radio = proTableRef.value?.tableData[3].id
  proTableRef.value?.element?.setCurrentRow(proTableRef.value?.tableData[3])
}

watch(
  () => proTableRef.value?.radio,
  () => proTableRef.value?.radio && ElMessage.success(`选中 id 为【${proTableRef.value?.radio}】的数据`)
)

// 删除用户信息
const deleteAccount = async (params: ResUserList) => {
  await useHandleData(UserAPI.deleteUser, { id: [params.id] }, `删除【${params.username}】用户`)
  proTableRef.value?.getTableList()
}

// 重置用户密码
const resetPass = async (params: ResUserList) => {
  await useHandleData(UserAPI.resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`)
  proTableRef.value?.getTableList()
}

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null)
const batchAdd = () => {
  const params = {
    title: '用户',
    tempApi: UserAPI.exportUserInfo,
    importApi: UserAPI.batchAddUser,
    getTableList: proTableRef.value?.getTableList,
  }
  dialogRef.value?.acceptParams(params)
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null)
const openDrawer = (title: string, row: Partial<ResUserList> = {}) => {
  const params = {
    title,
    isView: title === '查看',
    row: { ...row },
    api: title === '新增' ? UserAPI.addUser : title === '编辑' ? UserAPI.editUser : undefined,
    getTableList: proTableRef.value?.getTableList,
  }
  drawerRef.value?.acceptParams(params)
}
</script>
