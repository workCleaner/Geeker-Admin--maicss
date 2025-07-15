<template>
  <el-form :model="form" label-width="auto">
    <el-form-item label="通过 props 传递数据">
      <Dict v-model="form.dict1" :options="passedData.options" type="radio" prop="dict1" />
    </el-form-item>
    <el-form-item label="通过远程获取数据">
      <Dict
        v-model="form.dict2"
        :options="remoteData.options"
        remote
        type="radio-button"
        :code="remoteData.code"
        prop="dict2"
      />
    </el-form-item>
    <el-alert
      title="代码里设置了 options: [ { label: '3', value: 3 }, { label: '4', value: 4 } ]，但是 remote 的优先级更高，所以会显示 remote 的 options。字典数据因为不常修改，所以设置了本地缓存，默认时间是30天。remote 为 true 的时候，会优先去本地缓存获取数据。如果需要清除缓存，可以调用 clearDict 方法。ProTable 中使用 enum 的时候也采用了这个机制"
      :closable="false"
      type="success"
    />
    <p>formData: {{ form }}</p>
  </el-form>
</template>

<script setup lang="ts">
import Dict from '@/components/Dict/index.vue'
import { ref } from 'vue'
const form = ref({
  dict1: 1,
  dict2: 1,
})

const passedData = {
  options: [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
  ],
}

const remoteData = {
  code: 'gender',
  options: [
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ],
}
</script>
