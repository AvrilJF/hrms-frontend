<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div class="admin-main">
     <!-- 顶部导航 -->
      <el-header
        style="display: flex; justify-content: space-between; align-items: center; background: #fff; border-bottom: 1px solid #e6e6e6">
        <span style="font-size: 16px; font-weight: bold">企业人事管理系统</span>
        <div style="display: flex; align-items: center; gap: 15px">
          <el-icon>
            <Moon />
          </el-icon>
          <el-button type="danger" size="small" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <!-- 子页面内容（核心！嵌套路由的出口） -->
      <el-main style="padding: 20px; background: #f5f5f5; min-height: calc(100vh - 60px)">
        <router-view />
      </el-main>
    </div>
  </div>
</template>



<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Sidebar from '../../components/Layout/Sidebar.vue'

const router = useRouter()

// 退出登录
const logout = () => {
  localStorage.removeItem('userRole')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>