<template>
  <div class="browser">
<!--    浏览器功能栏-->
   <div class="browser-bar">
       <el-input  v-model ="startUrl" placeholder="输入要访问的网址" @keyup.enter="visitUrl()" style="font-weight: bold">
         <template #prepend>
           <el-button-group>
             <el-button :class="{'selector-handle':true,'selector-handle-fix': isOpenSelectorHelper}" title="选择器开关"  @click="toggleSelectorHelper" :icon="TopLeft"   />
             <el-button class="selector-cut" title="缩小爬取范围" @click="cut()"  :icon="Scissor"   />
           </el-button-group>
         </template>
         <template #append>
           <el-button-group>
             <el-button class="browser-refresh" title="读取缓存"  :icon="Refresh" @click="refresh()"/>
             <el-button class="browser-visit" title="访问该网址"  :icon="Position" @click="visitUrl()" />
           </el-button-group>
         </template>
       </el-input>
   </div>
<!--    浏览器展示区域-->
  <el-skeleton :rows="5" :count = '3' :throttle="100" :loading='skeletonLoading' animated  @click="updateSelectorInfo()">
    <div id ="browser-view-box" >
      <div id ="browser-view"></div>
    </div>
  </el-skeleton>
  </div>
</template>

<script setup>
import VConsole from 'vconsole'
import { Position,Refresh,Scissor,TopLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SelectorHelper from './SelectorHelper.vue'
import axios from 'axios'
import {ref, onMounted, onUnmounted, provide, getCurrentInstance} from 'vue'
// const vConsole = new VConsole();
//  响应式变量
const isOpenSelectorHelper = ref(false)
const skeletonLoading = ref(false)
const startUrl = ref('')
let iframeSelectorInfo = ref({})
//  非响应式变量
let iframeWindow = {}
let oldHtml = ''
// --------------------------------------------------------------
const client_host = new URL(document.baseURI).host
const baseUrl = window.espider.server.host +':'+ window.espider.server.port
                + '/proxy?client_host='+ client_host +'&from_source='
// startUrl.value = 'https://www.baidu.com'
startUrl.value = 'https://chengyi.jmu.edu.cn/xygk/xyfg1.htm'

// const currentInstance = getCurrentInstance()
// const { $emitter } = currentInstance.appContext.config.globalProperties


const toggleSelectorHelper = (method='') =>{    //  开关选择器模块
  iframeWindow = document.getElementById('browser-view').contentWindow
  if (iframeWindow){
    if (!isOpenSelectorHelper.value){
      iframeWindow.selectorHelper = window.selectorHelper
      iframeWindow.selectorHelper.open()
      iframeWindow.selectorHelper.setDocument(iframeWindow.document)
      iframeWindow.selectorHelper.openFindSame()
      iframeWindow.selectorHelper.noShow()
      // console.log(iframeWindow);
    }else if (isOpenSelectorHelper.value){
      iframeWindow?.selectorHelper?.close()
    }
    if (method === 'close')  iframeWindow?.selectorHelper?.close()
    isOpenSelectorHelper.value = !isOpenSelectorHelper.value
  }
}

function filterUrl(dom){
  function extractUrl(urlString){
    let url = ''
    urlString = urlString.replace(document.location.origin,'')
    const urlStringList = urlString.split('/')
    // console.log(urlStringList[0]);
    // console.log(urlStringList);
    if (urlStringList[0] === '.' || urlStringList[0] === '..' || urlStringList[0] === '' ){
      urlStringList.shift()
      const urlObj = new URL(startUrl.value.trim())
      url = urlObj.origin + urlString
    }
    // console.log(client_host,url);
    return url
  }
  const allImagesTag = dom.querySelectorAll('img')
  allImagesTag.forEach(node=>{
    const src = extractUrl(node.src)
    node.src =src
  })
  const allScriptTag = dom.querySelectorAll('script')
  allScriptTag.forEach(node=>{
    const src = extractUrl(node.src)
    node.src =src
  })
  const allLinkTag = dom.querySelectorAll('link')
  allLinkTag.forEach(node=>{
    const href = extractUrl(node.href)
    node.href =href
  })

}

function createFrame(HTML){
  setTimeout(()=>{
    let frame = document.createElement("iframe");
    let browser = document.getElementById('browser-view')
    frame.id="browser-view"
    frame.class="browser-view"
    frame.referrerpolicy="no-referrer"
    frame.sandbox="allow-same-origin allow-scripts allow-forms"  // allow-popups
    frame.style.width = '100%'
    frame.style.height = '90vh'
    frame.style.border = 'none'
    frame.onload = function () {
      let browser = document.getElementById('browser-view')
      let browserWin = browser.contentWindow
      browserWin.selectorHelper = window.selectorHelper
      browserWin.document.body.style.height = browser.style.height
      browserWin.document.body.style.width = browser.style.width
      // browserWin.document.body.onclick = function () {  updateSelectorInfo()  }
      filterUrl(browserWin.document)
      browserWin.document.onmouseenter = (event)=>{
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }
    browser.parentNode.replaceChild(frame,browser)
    frame.srcdoc = HTML

  },0)

}
// const getSource =  ()=>{ }


const visitUrl = ()=>{    //  访问网址
  const browserStartUrlString = baseUrl +　encodeURI(startUrl.value.trim())
  window.startUrl = startUrl.value.trim()
  skeletonLoading.value = true
  // --------------------------------
  iframeWindow?.selectorHelper?.close()
  isOpenSelectorHelper.value = false
  // --------------------------------
  axios.get(browserStartUrlString).then(res=>{
    let data = res.data
    if (typeof data !== 'string')  data = JSON.stringify(data)   // 可能json，进行转化
    createFrame(data)
    oldHtml = data
    skeletonLoading.value = false
  })
}


const refresh = ()=> {   //  根据缓存重新加载网页，不经过服务器
  iframeWindow?.selectorHelper?.close()
  isOpenSelectorHelper.value = false
  createFrame(oldHtml)
}

const cut = ()=>{
  iframeWindow?.selectorHelper?.cut()
}



// DOMContentLoaded


let oldXHR = window.XMLHttpRequest
function hookXHR() {
  let realXHR = new oldXHR();
  let oldSendFun = realXHR.send;
  realXHR.send = function (body) {
    console.log("拦截到消息提",body)
    oldSendFun.call(realXHR,body)
  }
  return realXHR;
}
//
window.XMLHttpRequest = hookXHR;
//
// //这是一个测试用例
// let ajax = new XMLHttpRequest();
// ajax.open('get', 'https://localhost:3000/api/gethitthecity?', true);
// ajax.send('name=2');


</script>

<style scoped>
.browser{
  display: block;
  box-sizing: border-box;
  position: relative;
  margin: 0;
  padding: 0;
  height:96vh;
  width: 100%;
  background-color: #f6f5f5;
}



.browser-refresh:hover,.browser-visit:hover,.selector-cut:hover,.selector-handle:hover{
  color: #1d1d1d !important;
  font-weight: 800;
  font-size: 1.3em;
}
.browser-visit:hover{
  background-color: #3abb79 !important;
}
.browser-refresh:hover{
  background-color: #9565ce !important;
}
.selector-cut:hover{
  background-color: #fc4831 !important;
}
.selector-handle:hover{

  background-color: #61c2d9  !important;
}
.selector-handle-fix{
  background-color: #61c2d9  !important;
  color: #1d1d1d !important;
  font-weight: 800;
  font-size: 1.3em;
}

</style>
<style>
.el-input-group,.el-scrollbar__view{
  padding: 0;
  margin: 0;
}
</style>
