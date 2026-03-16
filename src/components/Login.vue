<template>
  <div class="login-container">
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 图标 -->
      <div class="logo-circle">
        <img src="../assets/logo.png" alt="logo" class="logo-img" />
      </div>
      <!-- 标题 -->
      <h1 class="title">企业人事管理系统</h1>
      <p class="sub-title">请登录您的账户</p>
      <!-- 登录表单 -->
      <el-form :model="loginForm" class="login-form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            class="input-item"
            :style="{ fontSize: '16px', height: '40px' }"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="input-item"
            :style="{ fontSize: '16px', height: '40px' }"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :style="{
              width: '100%',
              height: '45px',
              fontSize: '18px',
              backgroundColor: '#0066FF',
              border: 'none'
            }"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 演示账号 -->
      <div class="demo-account">
        <p class="demo-title">演示账号:</p>
        <div class="account-card-group">
          <!-- 系统管理员 -->
          <div class="account-card admin-card">
            <p class="role-name">系统管理员</p>
            <p>username: admin</p>
            <p>password: admin123</p>
          </div>
          <!-- 人事管理员 -->
          <div class="account-card hr-card">
            <p class="role-name">人事管理员</p>
            <p>username: hr</p>
            <p>password: hr123</p>
          </div>
          <!-- 普通员工 -->
          <div class="account-card employee-card">
            <p class="role-name">普通员工</p>
            <p>username: employee</p>
            <p>password: employee123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

// 登录表单数据
const loginForm = ref({
  username: 'admin', // 默认填充admin
  password: 'admin123' // 默认填充admin123
})

// 登录处理
const handleLogin = async () => {
  // 1. 非空校验
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('请输入用户名和密码！')
    return
  }
  try {
    // 2. 调用登录接口
    const res = await request.post('/login', loginForm.value)
    // 3. 登录成功处理
    if (res.code === 200) {
      // 存储角色（关键：确保角色值是admin/hr/employee）
      localStorage.setItem('userRole', res.data.role)
      ElMessage.success('登录成功！')
      
      // 4. 跳转对应页面（核心：跳转到完整路径）
      if (res.data.role === 'admin') {
        router.push('/admin/dashboard') // 管理员跳转到首页
      } else if (res.data.role === 'hr') {
        router.push('/hr') // 人事跳转到人事页
      } else if (res.data.role === 'employee') {
        router.push('/employee') // 员工跳转到员工页
      }
    } else {
      ElMessage.error(res.msg || '登录失败！')
    }
  } catch (error) {
    // 5. 网络/接口错误兜底
    ElMessage.error('登录失败：' + (error.message || '服务器异常'))
    console.error('登录接口报错：', error)
  }
}
</script>

<style scoped>
/* 整体容器：居中 */
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

/* 登录卡片 */
.login-card {
  width: 500px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 图标圆形背景 */
.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #0066FF;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  width: 40px;
  height: 40px;
}

/* 标题样式 */
.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.sub-title {
  font-size: 16px;
  color: #999;
  margin-bottom: 30px;
}

/* 表单样式 */
.login-form {
  margin-bottom: 30px;
}

.input-item {
  width: 100%;
  margin-bottom: 20px;
}

.login-btn {
  font-weight: bold;
}

/* 演示账号样式 */
.demo-account {
  text-align: left;
}

.demo-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}

.account-card-group {
  display: flex;
  gap: 10px;
}

.account-card {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
}

/* 不同角色卡片背景色 */
.admin-card {
  background-color: #e8f4ff;
}
.hr-card {
  background-color: #e8f8e8;
}
.employee-card {
  background-color: #fff0f0;
}

.role-name {
  font-weight: bold;
  margin-bottom: 5px;
}
.admin-card .role-name {
  color: #0066FF;
}
.hr-card .role-name {
  color: #009900;
}
.employee-card .role-name {
  color: #FF6666;
}
</style>
