<template>
  <div class="admin-page">
    <h1>欢迎进入【系统管理员】页面</h1>
    <p>可开发功能：用户管理、角色管理、系统配置等</p>
    <el-button type="primary" @click="logout">退出登录</el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 退出登录
const logout = () => {
  localStorage.removeItem('userRole')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.admin-page {
  padding: 50px;
  text-align: center;
}
h1 {
  color: #0066FF;
  margin-bottom: 20px;
}
</style>