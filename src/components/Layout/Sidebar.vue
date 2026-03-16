<template>
  <el-aside width="10%" style="background-color: #2e3b4e; height: 100vh">
    <div style="text-align: center; line-height: 60px; color: #fff; font-size: 16px; background-color: #1f2d3d">
      企业人事管理系统
    </div>
    <el-menu
      default-active="/admin/dashboard"
      class="el-menu-vertical-demo"
      router
      background-color="#2e3b4e"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/admin/dashboard">
        <el-icon><Monitor /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/admin/dept">
        <el-icon><OfficeBuilding /></el-icon>
        <span>部门管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/user">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/stats">
        <el-icon><DataLine /></el-icon>
        <span>统计管理</span>
      </el-menu-item>
    </el-menu>
    <div class="sidebar-footer" style="position: absolute; bottom: 0; width: 100%; padding: 10px; color: #fff; font-size: 12px">
      <p>系统管理员</p>
      <p style="font-size: 10px; opacity: 0.8">admin@example.com</p>
    </div>
  </el-aside>
</template>

<script setup>
import { Monitor, OfficeBuilding, User, DataLine } from '@element-plus/icons-vue'
</script>