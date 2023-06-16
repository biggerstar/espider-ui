<template>
  <el-dialog  draggable v-model="dialogTableVisible"
             width="310px" :modal = 'false'  :destroy-on-close = 'true'  >
    <el-form :inline="true"  :model="addNewFiledFrom" >
      <el-form-item  >
        <el-input v-model="addNewFiledFrom.addFieldName" placeholder="输入添加的字段" />
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="append">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-tree
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="dataSource"
      draggable
      default-expand-all
      node-key="id"
      :expand-on-click-node="false"
      :highlight-current = 'true'
      @node-click = 'handleClick'
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop" >
    <template #default="{ node, data }">
        <span class="custom-tree-node" >
          <span >{{node.label }}</span>
<!--          <el-icon ></el-icon>-->
          <span class="control-bar" v-show="currentNode === data['$treeNodeId'] ">
            <el-button type="primary" circle @click="openAddDialog(data)" :icon="Plus" />
            <el-button type="warning" circle @click="modify(data)" :icon="Edit" />
            <el-button type="danger" circle @click="remove(node, data)" :icon="Delete" />
          </span>
        </span>
    </template>
  </el-tree>



</template>

<script  setup>
import { Delete, Edit ,Plus} from '@element-plus/icons-vue'
import { ref, reactive} from 'vue'
import  { ElTree } from 'element-plus'

const visible = ref(true)
let currentNode = ref(0)
let dialogTableVisible = ref(false)
const addNewFiledFrom = reactive({
  addFieldName: '',
  currentNodeData:{}
})


const handleDragStart = (node, ev) => {
  console.log('drag start', node)
}
const handleDragEnter = (  draggingNode,  dropNode, ev) => {
  // console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (draggingNode,ropNode,  ev) => {
  // console.log('tree drag leave:', dropNode.label)
}
const handleDragOver = (draggingNode, dropNode, ev) => {
  // console.log('tree drag over:', dropNode.label)
}
const handleDragEnd = ( draggingNode,  dropNode,   dropType,  ev) => {
  // console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
const handleDrop = (  draggingNode, dropNode,dropType,  ev) => {
  // console.log('tree drop:', dropNode.label, dropType)
}
const allowDrop = (draggingNode, dropNode, type) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner'
  } else {
    return true
  }
}
const allowDrag = (draggingNode) => {
  return !draggingNode.data.label.includes('Level three 3-1-1')
}

const handleClick = (clickNode,TreeNode,ev)=>{
  currentNode.value = clickNode['$treeNodeId']
  // console.log('clickNode',currentNode,clickNode);
  // console.log('TreeNode',TreeNode);
  // ElTree.get
  // console.log(ev);
}

let id = 1000
const append = ()=>{
  const data = addNewFiledFrom.currentNodeData
  dialogTableVisible.value = false
  addNewFiledFrom.currentNodeData = ''
  const newField = {
    id: id++,
    label: addNewFiledFrom.addFieldName,
    children: []
  }
  if (!data.children) {  data.children = []  }
  data.children.push(newField)
}

const openAddDialog = (data)=>{
  dialogTableVisible.value = true
  addNewFiledFrom.currentNodeData = data
}
const modify = (data)=>{

}
const remove = (node, data)=>{
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource = [...dataSource]
}


let dataSource = [
  {
    label: '{ }',
    dis:true,
    children: [
      {
        label: '【 】肖申克的救赎1',
        children: [
          {
            label: '肖申克的救赎1-1',
          },
        ],
      },
      {
        label: '{ }肖申克的救赎1',
        children: [
          {
            label: '肖申克的救赎1-1',
          },
        ],
      },
      {
        label: '【 】肖申克的救赎1',
        children: [
          {
            label: '肖申克的救赎1-1',
          },
        ],
      },
      {
        label: '{ }肖申克的救赎1',
        children: [
          {
            label: '肖申克的救赎1-1',
          },
        ],
      },
    ],
  }]
let dataSource1 = [
  {
    label: '肖申克的救赎',
    children: [
      {
        label: '肖申克的救赎1',
        children: [
          {
            label: '肖申克的救赎1-1',
          },
        ],
      },
    ],
  },
  {
    label: '盗梦空间',
    children: [
      {
        label: '盗梦空间-1',
        children: [
          {
            label: '盗梦空间-1-1',
          },
        ],
      },
      {
        label: '盗梦空间 2 ',
        children: [
          {
            label: '盗梦空间-2-1',
          },
        ],
      },
    ],
  },
  {
    label: '复仇者联盟 ',
    children: [
      {
        label: '复仇者联盟-1',
        children: [
          {
            label: '复仇者联盟-1-1',
          },
        ],
      },
      {
        label: '复仇者联盟-2',
        children: [
          {
            label: '复仇者联盟-2-1',
          },
        ],
      },
    ],
  },
]



</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.control-bar >.el-button{
  height: 0.9em;
  width: 0.9em;
}

.el-form-item{
  padding: 0 !important;
  margin: 0 !important;
}
</style>
<style>
.el-dialog {
  /*height: 80px!important;*/
  /*width: 300px!important;*/
  /*padding: 0 !important;*/
  margin: 0 !important;
  background-color: rgba(11,11,11,0.2);
  /*position: fixed !important;*/
  /*top: 0 !important;*/
  /*left: 0;*/
  /*background-color: red !important;*/
  /*z-index: 10000 !important;*/
}
</style>
