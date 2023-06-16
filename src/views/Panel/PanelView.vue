<script setup>
import {RouterLink,RouterView} from 'vue-router'
import { ElContainer,ElHeader,ElMain,ElAside } from 'element-plus'
import AsideView from './components/Aside.vue'
import MainView from './components/Main.vue'
import HeaderView from './components/Header.vue'
</script>

<template>
  <div class="common-layout">
    <el-container direction = 'vertical'>
      <el-header>
        <HeaderView/>
      </el-header>
      <el-container>
        <el-aside width="200px"  >
          <AsideView/>
        </el-aside>
        <el-main>
          <MainView/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style>

.el-container{
  height: 100vh;
  width: 100vw;
  background-color: #f0f5f5;
}
.el-aside{
  height: auto;
  margin-top: 8px;
}
.el-header{
  background-color: #ffffff;
}
.el-main{
  background-color: #ffffff;
  border-radius: 5px;
  margin: 8px 8px 0 8px;
}
</style>
