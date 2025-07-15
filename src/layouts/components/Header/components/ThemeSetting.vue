<template>
  <div class="theme-setting">
    <icon-park-outline-theme class="cursor-pointer" @click="openDrawer" />
  </div>
</template>

<script setup lang="ts">
import mittBus from '@/utils/mittBus'
import IconParkOutlineTheme from '~icons/icon-park-outline/theme?width=20px&height=20px'

const openDrawer = () => {
  mittBus.emit('openThemeDrawer')
}
</script>
