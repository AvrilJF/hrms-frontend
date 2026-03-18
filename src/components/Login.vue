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
// 1. 导入Vue3响应式API：ref创建基本类型响应式变量
import { ref } from 'vue'
// 2. 导入Element Plus消息提示组件：用于操作反馈
import { ElMessage } from 'element-plus'
// 3. 导入封装的Axios请求工具：已配置baseURL/拦截器等
import request from '../utils/request'
// 4. 导入Vue Router组合式API：用于页面跳转
import { useRouter } from 'vue-router'

// 初始化路由实例（替代Vue2的this.$router）
const router = useRouter()

// ref定义登录表单响应式数据：默认填充admin账号（方便测试）
const loginForm = ref({
  username: 'admin',    // 用户名默认值
  password: 'admin123'  // 密码默认值
})

// 定义登录处理方法：async标记为异步函数（兼容await）
const handleLogin = async () => {
  // 第一步：非空校验 → 用户名/密码为空时提示并终止
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('请输入用户名和密码！') // 错误提示弹窗
    return // 终止函数，不执行后续逻辑
  }

  try {
    // 第二步：调用登录接口 → POST请求，参数为表单数据
    const res = await request.post('/login', loginForm.value)

    // 第三步：登录成功处理（接口返回code=200为成功）
    if (res.code === 200) {
      // 3.1 存储用户角色到本地存储（持久化，页面刷新不丢失）
      localStorage.setItem('userRole', res.data.role)
      // 3.2 登录成功提示
      ElMessage.success('登录成功！')
      
      // 3.3 按角色跳转对应页面（权限路由控制）
      if (res.data.role === 'admin') {
        router.push('/admin/dashboard') // 管理员跳后台首页
      } else if (res.data.role === 'hr') {
        router.push('/hr') // 人事跳人事模块
      } else if (res.data.role === 'employee') {
        router.push('/employee') // 员工跳员工模块
      }
    } else {
      // 接口返回非200 → 提示失败（优先用接口返回的msg）
      ElMessage.error(res.msg || '登录失败！')
    }
  } catch (error) {
    // 第四步：异常捕获 → 网络错误/接口报错时执行
    ElMessage.error('登录失败：' + (error.message || '服务器异常'))
    console.error('登录接口报错详情：', error) // 控制台打印错误（开发调试）
  }
}
</script>

<style scoped>
/* scoped：样式仅作用于当前组件，避免全局污染 */

/* 根容器：占满屏幕，Flex居中，浅灰色背景 */
.login-container {
  width: 100vw;                /* 宽度=视口宽度 */
  height: 100vh;               /* 高度=视口高度 */
  display: flex;               /* Flex布局 */
  justify-content: center;     /* 水平居中 */
  align-items: center;         /* 垂直居中 */
  background-color: #f5f5f5;   /* 浅灰色背景 */
}

/* 登录卡片：白色背景+阴影+圆角，核心内容区 */
.login-card {
  width: 500px;                /* 卡片宽度 */
  padding: 40px;               /* 内边距 */
  background-color: #fff;      /* 白色背景 */
  border-radius: 8px;          /* 圆角 */
  text-align: center;          /* 内部文字居中 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 轻微阴影（立体感） */
}

/* Logo圆形容器：圆形蓝色背景，居中显示Logo */
.logo-circle {
  width: 80px;                 /* 宽高相等=圆形 */
  height: 80px;
  border-radius: 50%;          /* 圆角50%=圆形 */
  background-color: #0066FF;   /* 主色调蓝色 */
  margin: 0 auto 20px;         /* 上下外边距，左右自动（居中） */
  display: flex;               /* Flex布局 */
  justify-content: center;     /* 内部图片水平居中 */
  align-items: center;         /* 内部图片垂直居中 */
}

/* Logo图片：固定大小 */
.logo-img {
  width: 40px;
  height: 40px;
}

/* 系统主标题：大号加粗 */
.title {
  font-size: 28px;             /* 字号 */
  font-weight: bold;           /* 加粗 */
  color: #333;                 /* 深灰色文字 */
  margin: 10px 0;              /* 上下外边距 */
}

/* 副标题：小号浅灰色 */
.sub-title {
  font-size: 16px;             /* 字号 */
  color: #999;                 /* 浅灰色文字 */
  margin-bottom: 30px;         /* 底部外边距（与表单分隔） */
}

/* 登录表单：底部外边距 */
.login-form {
  margin-bottom: 30px;         /* 与演示账号区域分隔 */
}

/* 输入框项：全屏宽+底部外边距 */
.input-item {
  width: 100%;                 /* 输入框占满父容器 */
  margin-bottom: 20px;         /* 输入框之间的间距 */
}

/* 登录按钮：加粗字体 */
.login-btn {
  font-weight: bold;           /* 按钮文字加粗 */
}

/* 演示账号区域：文字左对齐 */
.demo-account {
  text-align: left;            /* 左对齐（与表单居中区分） */
}

/* 演示账号标题：小号浅灰色 */
.demo-title {
  font-size: 14px;             /* 字号 */
  color: #999;                 /* 浅灰色 */
  margin-bottom: 10px;         /* 与账号卡片分隔 */
}

/* 账号卡片组：Flex布局，子项间距10px */
.account-card-group {
  display: flex;               /* Flex布局 */
  gap: 10px;                   /* 卡片之间的间距（替代margin） */
}

/* 账号卡片通用样式：等分宽度+内边距+圆角 */
.account-card {
  flex: 1;                     /* 三个卡片平分父容器宽度 */
  padding: 10px;               /* 内边距 */
  border-radius: 4px;          /* 圆角 */
  font-size: 12px;             /* 小号字体（辅助信息） */
  color: #333;                 /* 深灰色文字 */
}

/* 不同角色卡片背景色区分 */
.admin-card {
  background-color: #e8f4ff;   /* 管理员：浅蓝色背景 */
}
.hr-card {
  background-color: #e8f8e8;   /* 人事：浅绿色背景 */
}
.employee-card {
  background-color: #fff0f0;   /* 员工：浅红色背景 */
}

/* 角色名称：加粗+底部间距 */
.role-name {
  font-weight: bold;           /* 加粗 */
  margin-bottom: 5px;          /* 与账号密码分隔 */
}

/* 不同角色名称文字颜色区分 */
.admin-card .role-name {
  color: #0066FF;              /* 管理员：蓝色 */
}
.hr-card .role-name {
  color: #009900;              /* 人事：绿色 */
}
.employee-card .role-name {
  color: #FF6666;              /* 员工：红色 */
}
</style>
