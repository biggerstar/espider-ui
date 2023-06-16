<template>
  <div style="height: 100% ; width: 100%" >
<!--    功能区域开始-->
    <div style="display:flex;justify-content: flex-end">
      <el-link href="/SpiderCreation"><el-button type="primary" > 直接新建爬虫 </el-button></el-link>
      <el-button type="primary" @click="newSpiderDialogVisible = !newSpiderDialogVisible" plain> 新建爬虫 </el-button>
    </div>
    <el-dialog v-model="newSpiderDialogVisible"   width="30%" center>
      <el-form
          :model="formLabelAlign"
          label-position  = 'top'
          label-width="80px"
          style="max-width: 460px" >
        <el-form-item label="爬虫名称 :">
          <el-input v-model="formLabelAlign.name" />
        </el-form-item>
        <el-button type="primary" @click="createNewSpider" >创建</el-button>
      </el-form>
    </el-dialog>

<!--  表格展示开始  -->
    <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
              style="width: 100% ; table-layout: fixed;"
              :max-height="800"
              :stripe = false size="large"
              :highlight-current-row = true >
      <el-table-column type="expand">
        <template #default="props">
          <p>State: {{ props.row.state }}</p>
          <p>City: {{ props.row.city }}</p>
          <p>Address: {{ props.row.address }}</p>
          <p>Zip: {{ props.row.zip }}</p>
        </template>
      </el-table-column>
      <el-table-column label="SpiderName" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-link href="/Panel/Setting" ><span >{{scope.row.date }}</span></el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="200"  >
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>name: {{ scope.row.name }}</div>
              <div>address: {{ scope.row.address }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.name }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Progress">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >Edit</el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-footer">
      <el-pagination
          background layout="prev, pager, next"
          @current-change="paginationChange"
          :current-page="currentPage"
          :total="tableData.length" :page-size = 'pageSize'    />
    </div>
  </div>
</template>

<script setup>
import {ref,reactive } from 'vue'
// 新建爬虫逻辑开始
const newSpiderDialogVisible = ref(false)
const formLabelAlign = reactive({ name: '' })
const createNewSpider = ()=>{
  // '进行提交创建新爬虫逻辑'
  // console.log(formLabelAlign.name);
  formLabelAlign.name = ''
  newSpiderDialogVisible.value = !newSpiderDialogVisible.value
}
// 表格信息展示逻辑开始
const currentPage = ref(1)
const pageSize = ref(12)
const paginationChange = (e)=>{ currentPage.value = e }

const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}

const tableData = [
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '11111111',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2222222222222',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '33333333333',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '44444444444',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '55555555555',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]


</script>
<style>
.pagination-footer{
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
