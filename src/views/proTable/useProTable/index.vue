<template>
  <div class="table-box">
    <ProTable ref="proTable" v-bind="tableConfig" @drag-sort="sortTable" @toolbar-click="toolbarClickHandler">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">
          导出用户数据
        </el-button>
        <el-button type="primary" plain @click="toDetail">To 子集详情页面</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除用户
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { type ResUserList } from '@/api/system/user'
import { useHandleData } from '@/hooks/useHandleData'
import { useDownload } from '@/hooks/useDownload'
import { useAuthButtons } from '@/hooks/useAuthButtons'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import ProTable from '@/components/ProTable/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import UserDrawer from '@/views/proTable/components/UserDrawer.vue'
import type { ProTableInstance } from '@/components/ProTable/interface'
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from '@element-plus/icons-vue'
import { UserAPI } from '@/api/system/user'
import getTableConfig from './config'

const router = useRouter()

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`)
}

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons()

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  // eslint-disable-next-line no-console
  console.log(newIndex, oldIndex)
  // eslint-disable-next-line no-console
  console.log(proTable.value?.tableData)
  ElMessage.success('修改列表排序成功')
}

// 删除用户信息
const deleteAccount = async (params: ResUserList) => {
  await useHandleData(UserAPI.deleteUser, { id: [params.id] }, `删除【${params.username}】用户`)
  proTable.value?.getTableList()
}

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(UserAPI.deleteUser, { id }, '删除所选用户信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

// 重置用户密码
const resetPass = async (params: ResUserList) => {
  await useHandleData(UserAPI.resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`)
  proTable.value?.getTableList()
}

// 切换用户状态
const changeStatusHandler = async (row: ResUserList) => {
  await useHandleData(
    UserAPI.changeUserStatus,
    { id: row.id, status: row.status == 1 ? 0 : 1 },
    `切换【${row.username}】用户状态`
  )
  proTable.value?.getTableList()
}

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm('确认导出用户数据?', '温馨提示', { type: 'warning' }).then(() =>
    useDownload(UserAPI.exportUserInfo, '用户列表', proTable.value?.searchParam)
  )
}

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null)
const batchAdd = () => {
  const params = {
    title: '用户',
    tempApi: UserAPI.exportUserInfo,
    importApi: UserAPI.batchAddUser,
    getTableList: proTable.value?.getTableList,
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
    getTableList: proTable.value?.getTableList,
  }
  drawerRef.value?.acceptParams(params)
}

const tableConfig = getTableConfig({
  changeStatusHandler,
})

const toolbarClickHandler = ({ name }) => {
  if (name === 'add') {
    openDrawer('新增')
  } else if (name === 'batchAdd') {
    batchAdd()
  } else if (name === 'export') {
    downloadFile()
  }
}
</script>
