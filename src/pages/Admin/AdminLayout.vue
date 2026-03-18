<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div class="admin-main">
      <!-- 顶部导航：修复el-header默认样式 -->
      <el-header class="admin-header">
        <!-- <div class="header-left">
          <span class="system-title">企业人事管理系统</span>
        </div> -->
        <div class="header-right">
          <el-icon class="theme-icon">
            <Moon />
          </el-icon>
          <el-button type="danger" size="small" @click="logout" class="logout-btn">
            退出登录
          </el-button>
        </div>
      </el-header>
      
      <!-- 子页面内容：修复高度计算 -->
      <el-main class="admin-content">
        <router-view />
      </el-main>
    </div>
  </div>
</template>



<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { Moon } from '@element-plus/icons-vue'

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
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.admin-main {
  flex: 1; /* 关键！占满侧边栏外的所有宽度 */
  display: flex;
  flex-direction: column;
  height: 100%;
}
/* 顶部导航：修复默认样式，保证按钮可见 */
.admin-header {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px; /* 增加左右内边距 */
  height: 60px !important; /* 强制设置高度，覆盖el-header默认值 */
  line-height: 60px;
}

.header-left .system-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px; /* 图标和按钮间距 */
}

.theme-icon {
  font-size: 18px;
  color: #666;
  cursor: pointer;
}

.logout-btn {
  padding: 6px 12px; /* 调整按钮内边距，保证文字显示完整 */
}

/* 内容区域：修复高度，避免滚动问题 */
.admin-content {
  padding: 20px;
  background: #f5f5f5;
  flex: 1; /* 占满剩余高度 */
  overflow-y: auto; /* 内容超出时滚动 */
  min-height: calc(100vh - 60px); /* 兼容不同屏幕 */
}
</style>
