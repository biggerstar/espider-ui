<template>
 <div class = 'guide-box'>
   <el-row >
     <el-col :sm="12" :lg="6" v-for="item in guideItem">
       <div class="guide-item" >
         <RouterLink :to='item.link'  aria-multiline="false">
           <el-result
               :title="item.title" >
             /*:sub-title="item.subTitle" */
             <template #icon>
               <component  :is="item.icon"></component>
             </template>
           </el-result>
         </RouterLink>
       </div>
     </el-col>
     </el-row>
 </div>
</template>

<script setup>
import { Edit, MostlyCloudy, Ticket, WarningFilled } from '@element-plus/icons-vue'
import {RouterLink} from 'vue-router'
import { reactive ,shallowReadonly} from 'vue'

const guideItem = shallowReadonly([
  {
    title:'浏览器',
    link:"/SpiderCreation/Browser",
    subTitle:"进行网页浏览并提取内容",
    icon:MostlyCloudy
  },
  {
    title:'代码编辑器',
    link:"/SpiderCreation/Editor",
    subTitle:"为ESpider集成的代码编辑器",
    icon:Edit
  },
  {
    title:'插件',
    link:"",
    subTitle:"ESpider内置插件和用户插件管理",
    icon:Ticket
  },
  {
    title:'调试信息',
    link:"",
    subTitle:"爬虫运行的相关调试信息",
    icon:WarningFilled
  },
])




</script>

<style scoped>
*{
  background-color: white;
}
.guide-box{
  margin: 30px;
  background-color: #f1efef;
}
.guide-item a,.guide-item p,.el-result{
  text-decoration: none !important;
  color: grey;
}
.el-result:hover{
  color: #0288f3;
  background-color: #ececec;
}
.el-result:active,.el-result__icon:active{
  transform: scale(0.9);
}
</style>
