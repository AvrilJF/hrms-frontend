<template>
  <div class="app-container">
    <!-- 搜索栏：结构不变，样式由全局控制 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.username"
        placeholder="搜索用户名"
        clearable
        @clear="handleQuery"
        @keyup.enter="handleQuery"
      />
      <el-select v-model="searchForm.role" placeholder="全部角色">
        <el-option label="全部角色" :value="null" />
        <el-option label="管理员" value="admin" />
        <el-option label="部门经理" value="hr" />
        <el-option label="普通员工" value="employee" />
      </el-select>
      <el-select v-model="searchForm.status" placeholder="全部状态">
        <el-option label="全部状态" :value="null" />
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      <el-button type="success" icon="Plus" @click="handleAdd">添加用户</el-button>
    </div>

    <!-- 用户列表：紧凑列宽 -->
    <el-table :data="userList" border stripe>
      <el-table-column prop="username" label="用户名" align="center" width="130">
        <template #default="scope">
          <el-icon size="14"><User /></el-icon>
          <span style="margin-left: 3px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="empId" label="关联员工" align="center" width="120">
        <template #default="scope">
          {{ getEmpName(scope.row.empId) || '未关联' }}
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.role === 'admin' ? 'danger' : (scope.row.role === 'hr' ? 'warning' : 'success')"
            size="small"
          >
            {{ 
              scope.row.role === 'admin' ? '管理员' : 
              (scope.row.role === 'hr' ? '部门经理' : '普通员工') 
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'" size="small">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button type="primary" icon="Edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            :type="scope.row.status === 1 ? 'warning' : 'success'"
            :icon="scope.row.status === 1 ? 'Lock' : 'Unlock'"
            size="small"
            @click="handleToggleStatus(scope.row)"
          >
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
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
    <el-dialog v-model="dialogVisible" title="添加新用户">
      <el-form :model="userForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!userForm.id">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="关联员工" prop="empId">
          <el-select v-model="userForm.empId" placeholder="请选择员工">
            <el-option v-for="emp in empOptions" :key="emp.id" :label="emp.empName" :value="emp.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="部门经理" value="hr" />
            <el-option label="普通员工" value="employee" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { User, Lock, Unlock } from '@element-plus/icons-vue'
import request from '@/utils/request'

// 所有业务逻辑完全不变，仅样式调整
const userList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const empOptions = ref([])
const searchForm = reactive({ username: '', role: null, status: null })
const queryParams = reactive({ current: 1, size: 10 })
const userForm = reactive({ 
  id: null, username: '', password: '', 
  empId: null, role: 'employee', status: 1 
})

const fetchUserList = async () => {
  try {
    const res = await request.get('/admin/api/user/list', { 
      params: { ...queryParams, ...searchForm } 
    })
    userList.value = res.records || []
    total.value = res.total || 0
  } catch (e) {
    ElMessage.error('加载用户列表失败：' + e.message)
    console.error('用户列表加载失败：', e)
  }
}

const fetchEmpOptions = async () => {
  try {
    empOptions.value = await request.get('/admin/api/employee/options')
  } catch (e) {
    ElMessage.error('加载员工列表失败：' + e.message)
  }
}

const getEmpName = (id) => {
  const emp = empOptions.value.find(e => e.id === id)
  return emp ? emp.empName : ''
}

const handleQuery = () => {
  queryParams.current = 1
  fetchUserList()
}

const handleSizeChange = (val) => { 
  queryParams.size = val; 
  fetchUserList() 
}
const handleCurrentChange = (val) => { 
  queryParams.current = val; 
  fetchUserList() 
}

const handleAdd = () => {
  Object.assign(userForm, { 
    id: null, username: '', password: '', 
    empId: null, role: 'employee', status: 1 
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(userForm, { ...row, password: '' })
  dialogVisible.value = true
}

const handleToggleStatus = async (row) => {
  try {
    const res = await request.post(`/admin/api/user/toggle-status/${row.id}`)
    if (res.code === 200) {
      ElMessage.success('状态更新成功')
      fetchUserList()
    } else {
      ElMessage.error(res.msg || '状态更新失败')
    }
  } catch (e) {
    ElMessage.error('状态更新失败：' + e.message)
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该用户，是否继续？', 
      '提示', 
      { type: 'warning' }
    )
    const res = await request.delete(`/admin/api/user/delete/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchUserList()
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
    const res = await request.post('/admin/api/user/save', userForm)
    if (res.code === 200) {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      fetchUserList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (e) {
    ElMessage.error('保存失败：' + e.message)
  }
}

onMounted(() => {
  fetchUserList()
  fetchEmpOptions()
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
:deep(.el-radio) {
  margin-right: 10px;
}
</style>