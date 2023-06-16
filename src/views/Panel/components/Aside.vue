<template>
  <el-menu
      default-active="/Panel/SpiderManager"
      class="el-menu-vertical-demo"
      :router = true >
    <el-menu-item index="/Panel/DashBoard">
      <el-icon><icon-menu /></el-icon>
      <span>仪表盘</span>
    </el-menu-item>
    <el-menu-item index="/Panel/SpiderManager">
      <el-icon><icon-menu /></el-icon>
      <span>爬虫管理</span>
    </el-menu-item>

    <el-menu-item index="/Panel/PluginManager"  >
      <el-icon><document /></el-icon>
      <span>插件管理</span>
    </el-menu-item>
    <el-menu-item index="/Panel/Setting">
      <el-icon><setting /></el-icon>
      <span>ESpider设置</span>
    </el-menu-item>
  </el-menu>

</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>
