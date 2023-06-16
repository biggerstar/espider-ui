<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="25%">
        <Extract/>
      </el-aside>
      <el-container>
        <el-main >
          <RouterView />
        </el-main>
        <el-footer  v-show="isShowFooterFN()">
          <Footer/>
<!--          <Console/>-->
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, provide} from "vue";
import {RouterView,useRouter} from 'vue-router'
import Footer from './Footer/Footer.vue'
import Extract from './Extract/Extract.vue'
import Console from './Console/Console.vue'

const router = useRouter()
// console.log(router.currentRoute.value.path === '/SpiderCreation/GuidePage');
let isShowFooter  = ref(false)
const isShowFooterFN = ()=>{
  // console.log(11111);
  return  router.currentRoute.value.path !== '/SpiderCreation/GuidePage'
}



</script>

<style scoped>
*{
  background-color: #f6f4f4;
}
.el-container{
  overflow: hidden;
}
.el-main,.el-aside,.el-footer{
  background-color: white;
  border-radius: 5px;
}
.el-aside{

}
.el-main{
  padding: 0;
  height: 95vh;
  width: 98%;
  overflow: hidden;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 1vh;
}
.el-footer{
  height: 3.5vh;
  line-height: 3.5vh;
  margin-left: 10px;
  /*background-color: #e3d185;*/
}
.el-footer:hover{
  /*background-color: #2f8282;*/

}
</style>
