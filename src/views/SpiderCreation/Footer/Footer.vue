<template>
  <el-button-group>
    <RouterLink to="/SpiderCreation/GuidePage"> <el-button   effect="dark" :icon="HomeFilled"  >首页</el-button> </RouterLink>
    <RouterLink to="/SpiderCreation/Browser"> <el-button type="primary" effect="dark" :icon="MostlyCloudy"  >浏览器</el-button> </RouterLink>
    <RouterLink to="/SpiderCreation/Editor"> <el-button type="success"  effect="dark" :icon="Edit" >代码编辑器</el-button></RouterLink>
    <RouterLink to=""> <el-button type="warning" effect="dark" :icon="Ticket" color="#626aef">插件</el-button></RouterLink>
    <RouterLink to=""> <el-button type="danger" effect="dark" :icon="WarningFilled"  >调式信息</el-button></RouterLink>
  </el-button-group>
</template>

<script setup>
import { Edit, MostlyCloudy, Ticket, WarningFilled,HomeFilled } from '@element-plus/icons-vue'
import {RouterLink} from 'vue-router'


</script>

<style scoped>
.el-tag{
  /*height: 3.2vh;*/
  /*min-width: 160px !important;*/
  /*width: 160px;*/
  font-size: 1.2em;
}

</style>
