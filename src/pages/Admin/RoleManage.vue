<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="search-bar">
      <el-button type="success" icon="Plus" @click="handleAdd">新增角色</el-button>
    </div>

    <!-- 角色列表 -->
    <el-table :data="roleList" border stripe style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column prop="roleCode" label="角色编码" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button type="primary" icon="Edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button 
            type="danger" 
            icon="Delete" 
            size="small" 
            @click="handleDelete(scope.row.id)"
            :disabled="scope.row.roleCode === 'admin'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="角色信息" width="40%">
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="如：admin/hr" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

// 数据定义
const roleList = ref([])
const dialogVisible = ref(false)
const roleForm = reactive({ id: null, roleName: '', roleCode: '', description: '' })

// 获取角色列表
const fetchRoleList = async () => {
  const res = await request.get('/admin/api/role/list')
  roleList.value = res.data
}

// 新增
const handleAdd = () => {
  Object.assign(roleForm, { id: null, roleName: '', roleCode: '', description: '' })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  Object.assign(roleForm, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (id) => {
  await ElMessageBox.confirm('此操作将永久删除该角色，是否继续？', '提示', { type: 'warning' })
  await request.delete(`/admin/api/role/delete/${id}`)
  ElMessage.success('删除成功')
  fetchRoleList()
}

// 保存
const confirmSave = async () => {
  await request.post('/admin/api/role/save', roleForm)
  ElMessage.success('操作成功')
  dialogVisible.value = false
  fetchRoleList()
}

onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.search-bar {
  margin-bottom: 20px;
}
</style>