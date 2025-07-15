<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <meteor-icons-language class="cursor-pointer" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Language',
})
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'
import type { LanguageType } from '@/stores/interface'
import MeteorIconsLanguage from '~icons/meteor-icons/language?width=20px&height=20px'

const i18n = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)

const languageList = [
  { label: '简体中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

const changeLanguage = (lang: string) => {
  i18n.locale.value = lang
  globalStore.language = lang as LanguageType
}
</script>
