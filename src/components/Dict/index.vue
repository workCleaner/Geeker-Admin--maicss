<template>
  <template v-if="localType === 'select'">
    <el-select v-model="value" v-bind="rest" :disabled="localDisabled">
      <el-option v-for="item in localOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </template>
  <template v-else-if="localType === 'radio'">
    <el-radio-group v-model="value" v-bind="rest" :disabled="localDisabled">
      <el-radio v-for="item in localOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
    </el-radio-group>
  </template>
  <!-- <template v-else-if="localType === 'checkbox'">
    <el-checkbox-group v-model="value" v-bind="rest">
      <el-checkbox v-for="item in options" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
  </template> -->
  <template v-else-if="localType === 'radio-button'">
    <el-radio-group v-model="value" v-bind="rest" :disabled="localDisabled">
      <el-radio-button v-for="item in localOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SelectProps } from 'element-plus'
import { useLoadingStore } from '@/stores/modules/loading'
import { useDictStore } from '@/stores/modules/dict'

interface DictProps extends Partial<SelectProps> {
  modelValue: string | number | boolean
  options: SelectOption[]
  type?: 'select' | 'radio' | 'checkbox' | 'radio-button'
  prop?: string
  code?: string
  remote?: boolean
}

const { modelValue, options, type = 'radio', remote = false, code, disabled, ...rest } = defineProps<DictProps>()
const loadingStore = useLoadingStore()

const emit = defineEmits<{
  (_e: 'update:modelValue', _value: string | number | boolean): void
}>()

const localType = computed(() => {
  if (type) {
    return type
  }
  if (options.length <= 3) {
    return 'radio'
  }
  return 'select'
})

const value = computed({
  get: () => modelValue,
  set: value => emit('update:modelValue', value),
})

const localOptions = ref<SelectOption[]>([])
const localDisabled = computed(() => {
  return disabled || loadingStore.loading
})

if (remote) {
  if (!code) {
    throw new Error('remote Dict prop [code] is required')
  }
  const dictStore = useDictStore()
  dictStore.getDict(code).then(data => {
    localOptions.value = data
  })
} else {
  localOptions.value = options
}
</script>
