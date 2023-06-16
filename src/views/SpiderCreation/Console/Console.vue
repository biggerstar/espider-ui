<template>
  <el-drawer v-model="isShowConsole" :direction="direction">
    <template #footer>
      <div style="flex: auto">
        <el-button  >cancel</el-button>
        <el-button type="primary" >confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>

import { ref,defineProps } from 'vue'
let isShowConsole = ref(false)
const props = defineProps({
  isShowConsole:Boolean
})

</script>

<style scoped>

</style>
