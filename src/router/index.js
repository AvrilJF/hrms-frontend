// 导入Vue Router的核心创建方法
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'

import AdminLayout from '../pages/Admin/AdminLayout.vue'
import Dashboard from '../pages/Admin/AdminBoard.vue'
import UserManage from '../pages/Admin/UserManage.vue'
import RoleManage from '../pages/Admin/RoleManage.vue'
import DeptManage from '../pages/Admin/DeptManage.vue'
import StatsManage from '../pages/Admin/StatsManage.vue'

import Hr from '../pages/Hr/HrBoard.vue'
import Employee from '../pages/Employee/EmployeeBoard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login' // 默认跳转到登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    component: AdminLayout, // 父布局（包含侧边栏+顶部导航）
    meta: { role: 'admin' },
    children: [
      { path: '', redirect: 'dashboard' }, // 根路径重定向到首页
      { path: 'dashboard', component: Dashboard, meta: { title: '后台首页' } }, // 首页
      { path: 'role', component: RoleManage, meta: { title: '角色管理' } },
      { path: 'dept', component: DeptManage, meta: { title: '部门管理', role: 'admin' } },
      { path: 'user', component: UserManage, meta: { title: '用户管理', role: 'admin' } },
      { path: 'stats', component: StatsManage, meta: { title: '统计管理', role: 'admin' } }
    ]
  },
  {
    path: '/hr',
    name: 'Hr',
    component: Hr,
    meta: { role: 'hr' } // 人事管理员页面
  },
  {
    path: '/employee',
    name: 'Employee',
    component: Employee,
    meta: { role: 'employee' } // 普通员工页面
  }
]
// 创建Vue Router实例，用于管理前端路由：页面跳转
const router = createRouter({
  history: createWebHistory(),// 配置路由模式为HTML5 History模式（无#号的URL）
  routes//提前定义好的路由配置：路由-组件
})
// 路由守卫：验证角色权限
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole')//从浏览器本地存储中获取（登录后存储的）
  // 登录页直接放行
  if (to.path === '/login') {
    next()
    return
  }
  // 未登录跳回登录页
  if (!userRole) {
    ElMessage.warning('请先登录！')
    next('/login')
    return
  }
  // 角色不匹配拦截
  if (to.meta.role && to.meta.role !== userRole) {
    ElMessage.error('无权限访问该页面！')
    next('/login')
    return
  }
  // 正常放行
  next()
})

export default router