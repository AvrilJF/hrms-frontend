<template>
  <div class="app-container">
    <!-- 搜索栏：保持结构，样式由全局控制 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.deptName"
        placeholder="搜索部门名称"
        clearable
        @clear="handleQuery"
        @keyup.enter="handleQuery"
      />
      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      <el-button type="success" icon="Plus" @click="handleAdd">添加部门</el-button>
    </div>

    <!-- 部门列表：紧凑列宽 -->
    <el-table :data="deptList" border stripe>
      <el-table-column prop="deptName" label="部门名称" align="center" width="150">
        <template #default="scope">
          <el-icon size="14"><OfficeBuilding /></el-icon>
          <span style="margin-left: 3px">{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deptManager" label="部门经理" align="center" width="120">
        <template #default="scope">
          {{ scope.row.deptManager || '无' }}
        </template>
      </el-table-column>
      <el-table-column prop="empCount" label="员工数量" align="center" width="80">
        <template #default="scope">
          <el-tag type="success" size="small">{{ scope.row.empCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="父级部门" align="center" width="120">
        <template #default="scope">
          {{ scope.row.parentId ? getDeptName(scope.row.parentId) : '无' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <el-button type="primary" icon="Edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="Delete" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:page-size="queryParams.size"
      v-model:current-page="queryParams.current"
      :total="total"
      layout="prev, pager, next, jumper, ->, total"
    />

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加新部门">
      <el-form :model="deptForm" label-width="70px">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门经理" prop="deptManager">
          <el-select v-model="deptForm.deptManager" placeholder="无">
            <el-option label="无" :value="null" />
            <el-option v-for="emp in empOptions" :key="emp.id" :label="emp.empName" :value="emp.empName" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级部门" prop="parentId">
          <el-select v-model="deptForm.parentId" placeholder="无">
            <el-option label="无" :value="null" />
            <el-option v-for="dept in deptOptions" :key="dept.id" :label="dept.deptName" :value="dept.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import request from '@/utils/request'

// 所有业务逻辑完全不变，仅样式调整
const deptList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const empOptions = ref([])
const deptOptions = ref([])
const searchForm = reactive({ deptName: '' })
const queryParams = reactive({ current: 1, size: 10 })
const deptForm = reactive({ id: null, deptName: '', deptManager: null, parentId: null })

const fetchDeptList = async () => {
  try {
    const res = await request.get('/admin/dept/list', { 
      params: { ...queryParams, deptName: searchForm.deptName } 
    })
    deptList.value = res.records || []
    total.value = res.total || 0
  } catch (e) {
    ElMessage.error('加载部门列表失败：' + e.message)
    console.error('部门列表加载失败：', e)
  }
}

const fetchEmpOptions = async () => {
  try {
    empOptions.value = await request.get('/admin/employee/options')
  } catch (e) {
    ElMessage.error('加载员工列表失败：' + e.message)
  }
}

const fetchDeptOptions = async () => {
  try {
    deptOptions.value = await request.get('/admin/dept/options')
  } catch (e) {
    ElMessage.error('加载部门选项失败：' + e.message)
  }
}

const getDeptName = (id) => {
  const dept = deptOptions.value.find(d => d.id === id)
  return dept ? dept.deptName : '无'
}

const handleQuery = () => {
  queryParams.current = 1
  fetchDeptList()
}

const handleSizeChange = (val) => { 
  queryParams.size = val; 
  fetchDeptList() 
}
const handleCurrentChange = (val) => { 
  queryParams.current = val; 
  fetchDeptList() 
}

const handleAdd = () => {
  Object.assign(deptForm, { id: null, deptName: '', deptManager: null, parentId: null })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(deptForm, { ...row })
  dialogVisible.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该部门，是否继续？', 
      '提示', 
      { type: 'warning' }
    )
    const res = await request.delete(`/admin/dept/delete/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchDeptList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败：' + e.message)
    }
  }
}

const confirmSave = async () => {
  try {
    const res = await request.post('/admin/dept/save', deptForm)
    if (res.code === 200) {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      fetchDeptList()
      fetchDeptOptions()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (e) {
    ElMessage.error('保存失败：' + e.message)
  }
}

onMounted(() => {
  fetchDeptList()
  fetchEmpOptions()
  fetchDeptOptions()
})
</script>

<style scoped>
/* 仅保留必要局部样式，全局已处理 */
:deep(.el-table .cell) {
  text-align: center;
}
:deep(.el-tag) {
  display: inline-block;
  line-height: 1;
}
</style>