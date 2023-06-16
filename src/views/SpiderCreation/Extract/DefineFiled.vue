<template>
  <div class="button-fn-bar">
    <el-button-group size="small">
      <el-button type="primary" @click="append()">新建字段</el-button>
      <el-button type="warning" plain :icon="Ticket" color="#626aef" @click="elJsonDrawerVisible = true; filedToJSON()" >JSON</el-button>
      <el-button type="success" plain :icon="Edit" @click="elCreateCodeDrawerVisible = true; GenerateCode() ">生成代码</el-button>
      <el-button type="info" plain>备用</el-button>
      <!--    <el-button type="danger" effect="dark" :icon="WarningFilled">调式信息</el-button>-->
    </el-button-group>
  </div>
<!--  新建字段开始-->
  <el-dialog draggable v-model="dialogTableVisible"
             width="320px" :modal='false' :destroy-on-close='true'>
    <el-form :inline="true" :model="addNewFiledFrom" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="addNewFiledFrom.addFieldName" placeholder="请输入字段"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handle()" native-type="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div class="demo-collapse">
    <el-scrollbar max-height="96vh">
      <el-collapse accordion  v-model="currentCollapseData">
        <el-collapse-item class="field-item"  :name="item.filedName" v-for="item in fileds">
          <template #title>
            <div style="display: flex;justify-content: space-between">
              <span v-show="item.fixed"  >
                <CircleCheckFilled class="finish-item" />
              </span>
              <span>
                <strong style="font-size: 1.5rem">{{ item.filedName }} </strong>
              </span>
            </div>
          </template>
          <div class="control-bar" style="margin-top: 12px;display: inline">
            <!--            <el-button type="primary" circle :icon="Plus" />-->
            <el-button v-if = "item.fixed" type="primary" title="取消该字段的固定" circle  :icon="Compass" @click="fixed"  />
            <el-button v-else  type="primary" title="固定该字段" circle :icon="Select" plain @click="fixed"  />
            <el-button type="warning" title="修改字段名" circle :icon="Edit" @click="modify"  />
            <el-button type="danger" title="删除该字段"  circle :icon="Delete" @click="doDelete" />
            <el-select v-model="item.select" style="height: 50px;width: 100px;margin-left: 30px " placeholder="Select" size="small">
              <el-option
                  v-for="(attr,index) in item.attr || []"
                  :key="attr"
                  :label="index"
                  :value="index"
              />
            </el-select>

          </div>
          <el-divider>
            <el-icon>
              <StarFilled/>
            </el-icon>
          </el-divider>

          <el-scrollbar max-height="550px" style="margin:0 8px " >
            <div >
              <p v-for="selector in item.selectChain" style="font-size: 1.1rem">{{ selector.length ? selector : '' }}</p>
              <p style="overflow:hidden;padding:8px 8px "> {{ item.data }} </p>
            </div>
          </el-scrollbar>
        </el-collapse-item>

      </el-collapse>
    </el-scrollbar>
  </div>

<!--  JSON开始-->
  <el-drawer
      v-model="elJsonDrawerVisible"
      title="JSON查看"
      size="75%"
      direction="ltr">
    <json-viewer :value="jsonViewData"  :expandDepth = '2' :expanded="true"  copyable />
  </el-drawer>

  <!--  生成代码开始-->
  <el-drawer
      v-model="elCreateCodeDrawerVisible"
      title="生成代码查看"
      size="75%"
      direction="ltr">
    <pre><code  class="language-javascript">{{GenerateCode()}}</code></pre>
  </el-drawer>

</template>

<script setup>
import {Delete, Edit, Plus, StarFilled, Ticket,CircleCheckFilled,Select,Compass } from '@element-plus/icons-vue'
import {InfoFilled} from '@element-plus/icons-vue'
import { js_beautify  } from 'js-beautify'
import Hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.css";

import {reactive, ref, inject,onMounted, getCurrentInstance, onUnmounted} from 'vue'
const currentInstance = getCurrentInstance()
// console.log(currentInstance);



const {$emitter } = currentInstance.appContext.config.globalProperties
let currentNode = ref(0)
let dialogTableVisible = ref(false)
let currentCollapseData = ref('')
const elJsonDrawerVisible = ref(false)
const elCreateCodeDrawerVisible = ref(false)
// const selectorInfo = ref( {"name": { "selector": "li>a>.info>p", "select": "text" }, "title": { "selector": ".position>h3", "select": "text" }, "image": { "selector": "li>a>.pic>img", "select": "src" } })
const selectorInfo = ref({})
const jsonViewData = ref([])
const selectToolValue = ref('')

let addNewFiledFrom = reactive({
  addFieldName: '',  // 手动外部输入框修改
  method:'append',
})
let monitorTimer = null
//-----------------------------
// onMounted(()=>{  $emitter.on('selectorInfo',getSelectorInfo) })
onMounted(()=>{   monitorTimer = setInterval(getSelectorInfo,500) })
onUnmounted(()=>{ if(monitorTimer) clearInterval(monitorTimer) })
//-----------------------------

const getSelectorInfo = ()=>{
  setTimeout(()=>{
    if(window.selectorHelper){
      let selectorInfo = selectorHelper.get() || []
      // console.log('selectorInfo',selectorInfo);
      const textList = []
      let selector = []
      const vNode = selectorInfo.find(vNode=> vNode.query)   // 找到任意包含能查到该组选择器的结点
      if (vNode && vNode.query.smart){
        // console.log(vNode.query.smart);
        selector =  vNode.query.smart
        if (selectorInfo.length > 1){
          selector = selector.replace(/:nth-child\(\d\)?/,'')
        }
        // selector = vNode.query.smart
      }
      // console.log(selector);
      // console.log(selectToolValue.value);
      // let selectValue = selectToolValue.value
      // if (selectValue === '') selectValue = 'text'
      fileds.value.map(val=>{
        if (val.fixed) return   // 如果已经固定表示完成该字段便不修改
        if (val.select === '') val.select = 'text'
        if (val.filedName === currentCollapseData.value){
          if (selectorInfo.length === 0){
            val.selectChain = []
            val.data = ''
            val.attr = []
            val.select = 'text'
          }
          if (selectorInfo.length === 1){
            const attr = selectorInfo[0].attributes
            attr['text'] = selectorInfo[0].text() || ''
            val.data = attr[val.select]
            val.attr = attr
            val.selectChain = [selector]
          }else if(selectorInfo.length > 1){
            selectorInfo.forEach(node=>{
              const attr = node.attributes
              attr['text'] = node.text()
              textList.push(attr[val.select] || '')
              val.attr = attr
            })
            val.data = JSON.stringify(textList, null,'\t' )
          }
          val.selectChain = [selector]
        }
      })

      // console.log(fileds.value);
      // relativeParent

    window.selectdFileds = fileds.value
      // filedToJSON()

    }
  },0)
}

const GenerateCode = ()=>{
  const startUrl = window.startUrl
  const selectorInfoDict = selectorInfo.value
  if (!startUrl){  return  '请访问网址后再进行操作！'  }
  if (!selectorInfoDict){  return  '请定义字段之后再进行操作！'  }
  let parseHTML = ` `
  for (let sk in selectorInfoDict) {
    const filedName = sk
    const selector = selectorInfoDict[sk].selector
    const select = selectorInfoDict[sk].select
    const getValue = ()=>{
      // $(node).text()
      if (select === 'text') return '$(node).text()'
      else  return `$(node).attr('${select}')`
    }
    parseHTML = parseHTML + ` $('${selector}').each((i,node)=>{ this.merge('${filedName}',${getValue()})})` + '\n'
  }
  const getConsole = ()=>{
    if (Object.keys(selectorInfoDict).length === 0) return 'response.data'
    else return  'this.getItems()'
  }


  let Template = `
      const ESpider = require('../ESpider/ESpider')
      class TestSpider extends ESpider.Spider{
          start() {
              this.get({ url:'${startUrl}'})
          }
          page(response) {
              const $ = response.$()
              ${parseHTML}
              console.log(${getConsole()})
          }
      }
      ESpider.crawl(TestSpider)
  `
  window.generatedCodeString =  js_beautify(Template)
  return  js_beautify(Template)
}


const filedToJSON = ()=>{
  let jsonData = []
  const everyAttr = {}
  fileds.value.forEach(filed=>{
    // console.log(filed);
    selectorInfo.value[filed.filedName] = {
      selector : filed.selectChain[0],
      select: filed.select
    }
    let data = filed.data
    // console.log(data);
    try {
      data = JSON.parse(filed.data)
    }catch (e) {  }
    // console.log(data);
    if (typeof data === 'string') {
      everyAttr[filed.filedName] = data
    }
    if (Array.isArray(data)){
      data.forEach((dataField,index)=>{
        if (!jsonData[index]) jsonData[index] = {}
        // console.log(dataField);
        jsonData[index][filed.filedName] = dataField
      })
    }
  })
  // console.log(everyAttr);
  jsonData = jsonData.map(item=>{
    return Object.assign(item,everyAttr)
  })
  jsonViewData.value = jsonData

}

const doDelete = () => {
  addNewFiledFrom.method = 'delete'
  fileds.value = fileds.value.filter(val=>{  return val.filedName !== currentCollapseData.value  })
}
const fixed = ()=>{
  fileds.value.map(val=>{
    if (val.filedName === currentCollapseData.value){
      val.fixed = !val.fixed
    }
  })
}

const modify = () => {
  dialogTableVisible.value = true;
  addNewFiledFrom.method = 'modify'
  addNewFiledFrom.addFieldName = currentCollapseData.value
}

const append = () => {
  addNewFiledFrom.addFieldName = ''
  dialogTableVisible.value = true;
  addNewFiledFrom.method = 'append'
}

const handle = (option) => {
  dialogTableVisible.value = false
  if (addNewFiledFrom.method === 'append'){
    if (addNewFiledFrom.addFieldName === '') return
    option = {
      filedName: addNewFiledFrom.addFieldName,
      // selectChain: ['.test', '.test:nth-child(1)'],
      // data: '这是一条演示内容',
      selectChain: [],
      data: ''
    }
    fileds.value.push(option)
  }else  if (addNewFiledFrom.method === 'modify'){
     fileds.value.map(val=>{
      if (val.filedName === currentCollapseData.value ){
        val.filedName = addNewFiledFrom.addFieldName
      }
    })
    addNewFiledFrom.currentName = addNewFiledFrom.addFieldName
  }

  // fileds = [...fileds]
}


let fileds = ref([
  // {
  //   filedName: 'name1',
  //   selectChain: ['.body1', '.a:nth-child(1)'],
  //   data:'这是一条演示内容'
  // },
  // {
  //   filedName: 'name2',
  //   selectChain: ['.body2', '.a:nth-child(2)'],
  //   data: '  Statistics for scrolly Cite this Entry “Scrolly.” Merriam-Webster.com Dictionary, Merriam-Webster, https://www.merriam-webster.com/dictionary/scrolly. Accessed ...'
  // },
  // {
  //   filedName: 'name2',
  //   selectChain: ['.body2', '.a:nth-child(2)'],
  //   data: '  Statistics for scrolly Cite this Entry “Scrolly.” Merriam-Webster.com Dictionary, Merriam-Webster, https://www.merriam-webster.com/dictionary/scrolly. Accessed ...'
  // },
  // {
  //   filedName: 'name2',
  //   selectChain: ['.body2', '.a:nth-child(2)'],
  //   data: '  Statistics for scrolly Cite this Entry “Scrolly.” Merriam-Webster.com Dictionary, Merriam-Webster, https://www.merriam-webster.com/dictionary/scrolly. Accessed ...'
  // },
  // {
  //   filedName: 'name2',
  //   selectChain: ['.body3', '.a:nth-child(3)'],
  //   data: 'this.scroll) { this.scroll = new BScroll(this.$refs.tabRoll, { startX: 0, // 配置的详细信息请参考better-scroll的官方文档 click: true, scrollX: true,...'
  // },
  //
  // {
  //   filedName: 'name4',
  //   selectChain: ['.body', '.a:nth-child(4)'],
  //   data: '内容由知识产权出版社提供 专利名称:一种基于Scr ol l yt e l l ing技术的数据可视化探索系 统 专利类型:发明专利 发明人:陈为,陆俊华,王杰,叶慧,顾宇辉 申请号:CN202010...'
  // },
  // {
  //   filedName: 'name4',
  //   selectChain: ['.body', '.a:nth-child(4)'],
  //   data: '内容由知识产权出版社提供 专利名称:一种基于Scr ol l yt e l l ing技术的数据可视化探索系 统 专利类型:发明专利 发明人:陈为,陆俊华,王杰,叶慧,顾宇辉 申请号:CN202010...'
  // },
  // {
  //   filedName: 'name4',
  //   selectChain: ['.body', '.a:nth-child(4)'],
  //   data: '内容由知识产权出版社提供 专利名称:一种基于Scr ol l yt e l l ing技术的数据可视化探索系 统 专利类型:发明专利 发明人:陈为,陆俊华,王杰,叶慧,顾宇辉 申请号:CN202010...'
  // },
  // {
  //   filedName: 'name4',
  //   selectChain: ['.body', '.a:nth-child(4)'],
  //   data: '内容由知识产权出版社提供 专利名称:一种基于Scr ol l yt e l l ing技术的数据可视化探索系 统 专利类型:发明专利 发明人:陈为,陆俊华,王杰,叶慧,顾宇辉 申请号:CN202010...'
  // },
  // {
  //   filedName: 'name4',
  //   selectChain: ['.body', '.a:nth-child(4)'],
  //   data: '内容由知识产权出版社提供 专利名称:一种基于Scr ol l yt e l l ing技术的数据可视化探索系 统 专利类型:发明专利 发明人:陈为,陆俊华,王杰,叶慧,顾宇辉 申请号:CN202010...'
  // },
  // {
  //   filedName: 'name4',
  //   selectChain: ['.body', '.a:nth-child(4)'],
  //   data: '内容由知识产权出版社提供 专利名称:一种基于Scr ol l yt e l l ing技术的数据可视化探索系 统 专利类型:发明专利 发明人:陈为,陆俊华,王杰,叶慧,顾宇辉 申请号:CN202010...'
  // },
])


</script>
<style>
.field-item, .el-collapse-item {
  font-size: 23px !important;
  text-indent: 30px;
}

.field-item p:hover {
  background-color: rgba(151, 145, 145, 0.2) !important;
}

.el-form-item {
  padding: 0 !important;
  margin: 0 !important;
}
.finish-item{
  font-size: 1.2rem;
  text-align: center;
  max-height: 36px;
  max-width: 36px;
  color: green;
  vertical-align: middle;
  font-weight: 800;
  padding-left: 10px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
<style>
.el-dialog {
  margin: 0 !important;
  background-color: rgba(11, 11, 11, 0.2);
}
</style>
