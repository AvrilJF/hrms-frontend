<template>
  <div class="employee-page">
    <h1>欢迎进入【普通员工】页面</h1>
    <p>可开发功能：个人信息、考勤打卡、请假申请等</p>
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
.employee-page {
  padding: 50px;
  text-align: center;
}
h1 {
  color: #FF6666;
  margin-bottom: 20px;
}
</style>