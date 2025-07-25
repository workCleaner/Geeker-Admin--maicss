<template>
  <div>
    <!-- drawer -->
    <template v-if="modalConfig.component === 'drawer'">
      <el-drawer v-model="modalVisible" v-bind="{ destroyOnClose: true, ...modalConfig.drawer }" @close="handleClose">
        <el-form ref="formRef" v-bind="form" :model="formData" :rules="formRules">
          <el-row :gutter="20">
            <template v-for="item in formItems" :key="item.prop">
              <el-col v-show="!item.hidden" v-bind="item.col">
                <el-form-item :prop="item.prop">
                  <!-- Label -->
                  <template #label>
                    <span v-if="typeof item.label === 'function'">
                      <component :is="item.label" />
                    </span>
                    <span v-else>
                      {{ item.label }}
                      <el-tooltip v-if="item.tips" v-bind="getTooltipProps(item.tips)">
                        <QuestionFilled class="w-4 h-4 mx-1" />
                      </el-tooltip>
                      <span v-if="modalConfig.colon">:</span>
                    </span>
                  </template>

                  <component :is="item.render" v-if="item.render" :row="formData" />

                  <!-- components -->
                  <template v-else-if="item.type === 'custom'">
                    <slot
                      :name="item.slotName ?? item.prop"
                      :prop="item.prop"
                      :form-data="formData"
                      :attrs="item.attrs"
                    ></slot>
                  </template>
                  <component
                    :is="componentMap.get(item.type!)"
                    v-else
                    v-model.trim="formData[item.prop]"
                    v-bind="{ style: { width: '100%' }, ...item.attrs }"
                  >
                    <template v-if="['select', 'radio', 'checkbox'].includes(item.type!)">
                      <component
                        :is="childrenMap.get(item.type!)"
                        v-for="opt in item.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      ></component>
                    </template>

                    <template v-if="item?.slotName && $slots[item.slotName]" #[item.slotName]>
                      <slot :name="item.slotName" />
                    </template>
                  </component>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>

        <template #footer>
          <el-button v-if="!formDisable" type="primary" :loading="isLoading" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleClose">{{ !formDisable ? '取 消' : '关闭' }}</el-button>
        </template>
      </el-drawer>
    </template>
    <!-- dialog -->
    <template v-else>
      <el-dialog
        v-model="modalVisible"
        v-bind="{ destroyOnClose: true, alignCenter: true, ...modalConfig.dialog }"
        @close="handleClose"
      >
        <el-form ref="formRef" v-bind="form" :model="formData" :rules="formRules">
          <el-scrollbar max-height="70vh" :view-style="{ overflowX: 'hidden' }">
            <el-row :gutter="20">
              <template v-for="item in formItems" :key="item.prop">
                <el-col v-show="!item.hidden" v-bind="item.col">
                  <el-form-item :prop="item.prop">
                    <template #label>
                      <span v-if="typeof item.label === 'function'">
                        <component :is="item.label" />
                      </span>
                      <span v-else>
                        {{ item.label }}
                        <el-tooltip v-if="item?.tips" v-bind="getTooltipProps(item.tips)">
                          <QuestionFilled class="w-4 h-4 mx-1" />
                        </el-tooltip>
                        <span v-if="modalConfig.colon">:</span>
                      </span>
                    </template>

                    <component :is="item.render" v-if="item.render" :row="formData" />

                    <template v-else-if="item.type === 'custom'">
                      <slot
                        :name="item.slotName ?? item.prop"
                        :prop="item.prop"
                        :form-data="formData"
                        :attrs="item.attrs"
                      ></slot>
                    </template>
                    <component
                      :is="componentMap.get(item.type!)"
                      v-else
                      v-model.trim="formData[item.prop]"
                      v-bind="{ style: { width: '100%' }, ...item.attrs }"
                    >
                      <template v-if="['select', 'radio', 'checkbox'].includes(item.type!)">
                        <component
                          :is="childrenMap.get(item.type!)"
                          v-for="opt in item.options"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        ></component>
                      </template>

                      <template v-if="item?.slotName && $slots[item.slotName]" #[item.slotName]>
                        <slot :name="item.slotName" />
                      </template>
                    </component>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
            <slot name="bottom" :form-data="formData"></slot>
          </el-scrollbar>
        </el-form>

        <template #footer>
          <el-button v-if="!formDisable" type="primary" :loading="isLoading" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleClose">{{ !formDisable ? '取 消' : '关闭' }}</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'
import {
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElSwitch,
  ElText,
  ElTimePicker,
  ElTimeSelect,
  ElTreeSelect,
  type FormProps,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import type { IComponentType, IModalConfig } from '../interface'
import InputTag from './InputTag.vue'
import IconSelect from './IconSelect.vue'
import { markRaw, onMounted, reactive, ref } from 'vue'

defineOptions({ name: 'ProModal' })

defineSlots<{ [key: string]: (_args: any) => any }>()
// 定义接收的属性
const props = defineProps<{ modalConfig: IModalConfig }>()
// 自定义事件
const emit = defineEmits<{ submitClick: []; customSubmit: [queryParams: IObject] }>()
// 组件映射表

const componentMap = new Map<IComponentType, any>([
  ['input', markRaw(ElInput)],
  ['select', markRaw(ElSelect)],
  ['switch', markRaw(ElSwitch)],
  ['cascader', markRaw(ElCascader)],
  ['input-number', markRaw(ElInputNumber)],
  ['input-tag', markRaw(InputTag)],
  ['time-picker', markRaw(ElTimePicker)],
  ['time-select', markRaw(ElTimeSelect)],
  ['date-picker', markRaw(ElDatePicker)],
  ['tree-select', markRaw(ElTreeSelect)],
  ['custom-tag', markRaw(InputTag)],
  ['text', markRaw(ElText)],
  ['radio', markRaw(ElRadioGroup)],
  ['checkbox', markRaw(ElCheckboxGroup)],
  ['icon-select', markRaw(IconSelect)],
  ['custom', ''],
])
const childrenMap = new Map<IComponentType, any>([
  ['select', markRaw(ElOption)],
  ['radio', markRaw(ElRadio)],
  ['checkbox', markRaw(ElCheckbox)],
])

const pk = props.modalConfig.pk ?? 'id' // 主键名，用于表单数据处理
const modalVisible = ref(false) // 弹窗显示状态
const formRef = ref<FormInstance>() // 表单实例
const formItems = reactive(props.modalConfig.formItems ?? []) // 表单配置项
const formData = reactive<IObject>({}) // 表单数据
const formRules: FormRules = {} // 表单验证规则
const formDisable = ref(false) // 表单禁用状态

const isLoading = ref(false)

const form = ref<Partial<Omit<FormProps, 'model' | 'rules'>>>({})
// 获取tooltip提示框属性
const getTooltipProps = (tips: string | IObject) => {
  return typeof tips === 'string' ? { content: tips } : tips
}
// 隐藏弹窗
const handleClose = () => {
  modalVisible.value = false
  formRef.value?.resetFields()
}
// 设置表单值
const setFormData = (data: IObject) => {
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key) && key in data) {
      formData[key] = data[key]
    }
  }
  if (Object.prototype.hasOwnProperty.call(data, pk)) {
    formData[pk] = data[pk]
  }
}
// 表单提交
const handleSubmit = useThrottleFn(() => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    if (typeof props.modalConfig.beforeSubmit === 'function') {
      props.modalConfig.beforeSubmit(formData)
    }
    if (!props.modalConfig?.formAction) {
      emit('customSubmit', formData)
      handleClose()
      return
    }
    isLoading.value = true

    try {
      await props.modalConfig.formAction(formData)
      if (props.modalConfig.component === 'drawer') {
        ElMessage.success(`${props.modalConfig.drawer?.title}成功`)
      } else {
        ElMessage.success(`${props.modalConfig.dialog?.title}成功`)
      }
      emit('submitClick')
      isLoading.value = false
      handleClose()
    } catch (error: any) {
      ElMessage.error(error)
    } finally {
      isLoading.value = false
    }
  })
}, 3000)

onMounted(() => {
  formItems.forEach(item => {
    if (item.initFn) {
      item.initFn(item)
    }
    formRules[item.prop] = item?.rules ?? []
    form.value = { labelWidth: 'auto', ...props.modalConfig?.form }

    if (['input-tag', 'custom-tag', 'cascader'].includes(item.type!)) {
      formData[item.prop] = Array.isArray(item.initialValue) ? item.initialValue : []
    } else if (item.type === 'input-number') {
      formData[item.prop] = item.initialValue ?? null
    } else {
      formData[item.prop] = item.initialValue ?? ''
    }
  })
})

// 暴露的属性和方法
defineExpose({
  setFormData,
  // 展示/因此 modal
  setModalVisible: (visible: boolean = true) => (modalVisible.value = visible),
  // 获取表单数据
  getFormData: (key: string) => formData[key] ?? formData,
  // 设置表单项值
  setFormItemData: (key: string, value: any) => (formData[key] = value),
  // 禁用表单
  handleDisabled: (disable: boolean) => {
    formDisable.value = disable
    form.value = {
      ...props.modalConfig.form,
      disabled: disable,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-input-number.is-without-controls .el-input__wrapper) {
  padding-right: 11px !important ;
  padding-left: 11px !important;
}
</style>
