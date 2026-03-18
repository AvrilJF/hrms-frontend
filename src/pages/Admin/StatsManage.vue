<template>
  <div class="stats-container">
    <!-- 顶部统计卡片 -->
    <div class="stats-card-group">
      <el-card class="stats-card">
        <div class="stats-card-header">
          <span class="stats-label">总员工数</span>
          <el-icon class="stats-icon"><User /></el-icon>
        </div>
        <div class="stats-value">{{ employeeStats.totalCount }}</div>
        <div class="stats-desc">
          <el-icon class="trend-icon"><ArrowUp /></el-icon>
          较上月增长{{ employeeStats.totalGrowth }}%
        </div>
      </el-card>

      <el-card class="stats-card">
        <div class="stats-card-header">
          <span class="stats-label">平均年龄</span>
          <el-icon class="stats-icon"><UserFilled /></el-icon>
        </div>
        <div class="stats-value">{{ employeeStats.avgAge }} 岁</div>
        <div class="stats-desc">在职员工平均年龄</div>
      </el-card>

      <el-card class="stats-card">
        <div class="stats-card-header">
          <span class="stats-label">平均薪资</span>
          <el-icon class="stats-icon"><Money /></el-icon>
        </div>
        <div class="stats-value">¥{{ employeeStats.avgSalary }}</div>
        <div class="stats-desc">
          <el-icon class="trend-icon"><ArrowUp /></el-icon>
          较上月增长{{ employeeStats.salaryGrowth }}%
        </div>
      </el-card>

      <el-card class="stats-card">
        <div class="stats-card-header">
          <span class="stats-label">部门数量</span>
          <el-icon class="stats-icon"><OfficeBuilding /></el-icon>
        </div>
        <div class="stats-value">{{ employeeStats.deptCount }}</div>
        <div class="stats-desc">公司部门总数</div>
      </el-card>

      <el-card class="stats-card">
        <div class="stats-card-header">
          <span class="stats-label">在职员工</span>
          <el-icon class="stats-icon"><Check /></el-icon>
        </div>
        <div class="stats-value">{{ employeeStats.onDutyCount }}</div>
        <div class="stats-desc">{{ employeeStats.onDutyRate }}% 的员工在职</div>
      </el-card>

      <el-card class="stats-card">
        <div class="stats-card-header">
          <span class="stats-label">薪资总支出</span>
          <el-icon class="stats-icon"><Wallet /></el-icon>
        </div>
        <div class="stats-value">¥{{ employeeStats.totalSalary }}</div>
        <div class="stats-desc">本月薪资总支出</div>
      </el-card>
    </div>

    <!-- 切换标签 + 时间筛选 -->
    <div class="chart-header">
      <el-radio-group v-model="activeTab" class="chart-tabs" @change="handleTabChange">
        <el-radio-button label="dept">部门分布</el-radio-button>
        <el-radio-button label="gender">性别分布</el-radio-button>
        <el-radio-button label="age">年龄分布</el-radio-button>
        <el-radio-button label="status">状态分布</el-radio-button>
        <el-radio-button label="salary">部门薪资</el-radio-button>
        <el-radio-button label="trend">入离职趋势</el-radio-button>
      </el-radio-group>

      <div class="time-filter">
        <span class="time-label">时间范围:</span>
        <el-select v-model="timeRange" placeholder="选择时间范围" style="width: 80px" @change="getStatsData">
          <el-option label="月度" value="month"></el-option>
          <el-option label="季度" value="quarter"></el-option>
          <el-option label="年度" value="year"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="chart-container">
      <div ref="chartRef" class="chart-box"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue' // 修复1：导入 onUnmounted
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  User,
  UserFilled,
  Money,
  OfficeBuilding,
  Check,
  Wallet,
  ArrowUp
} from '@element-plus/icons-vue'
// import request from '../utils/request'
import request from '@/utils/request' // 复用原有请求封装

// 响应式数据
const activeTab = ref('dept') // 激活的标签
const timeRange = ref('month') // 时间范围
const chartRef = ref(null) // 图表DOM引用
let myChart = null // 图表实例
const employeeStats = ref({
  // 默认统计数据
  totalCount: 0,
  totalGrowth: 0,
  avgAge: 0,
  avgSalary: 0,
  salaryGrowth: 0,
  deptCount: 0,
  onDutyCount: 0,
  onDutyRate: 0,
  totalSalary: 0
})

// 核心：切换标签时执行
const handleTabChange = async () => {
  try {
    // 1. 先销毁旧图表
    if (myChart) {
      myChart.dispose()
      myChart = null
    }
    // 2. 加载动画（可选）
    // ElMessage.info('正在加载数据...')
    // 3. 请求对应标签的数据
    const { data } = await request.get(`/admin/stats/${activeTab.value}`, {
      params: { timeRange: timeRange.value } // 修复2：携带时间参数
    })
    // 4. 渲染图表
    renderChart(data) // 修复3：调用 renderChart 而不是 initChart
  } catch (error) {
    ElMessage.error('加载图表数据失败：' + error.message)
    console.error(error)
  }
}

// 初始化图表（仅创建实例，不渲染数据）
const initChart = () => {
  // 如果实例已存在，先销毁
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  // 如果没有 DOM，直接返回
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  // 监听窗口大小变化，自适应图表
  window.addEventListener('resize', () => {
    if (myChart) myChart.resize() // 修复4：加判断避免空指针
  })
}

// 获取统计数据
const getStatsData = async () => {
  try {
    // 1. 获取顶部统计卡片数据
    const statsRes = await request.get('/admin/stats/employeeStats', {
      params: { timeRange: timeRange.value }
    })
    if (statsRes.code === 200) {
      employeeStats.value = statsRes.data
    }

    // 2. 获取图表数据
    const chartRes = await request.get(`/admin/stats/${activeTab.value}`, {
      params: { timeRange: timeRange.value }
    })
    if (chartRes.code === 200) {
      renderChart(chartRes.data)
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败：' + error.message)
    console.error('统计数据请求报错：', error)
  }
}

// 渲染图表
const renderChart = (data) => {
    if (!chartRef.value) return
  if (myChart) {
    myChart.dispose() // 修复8：渲染前先销毁旧实例
  }
  myChart = echarts.init(chartRef.value)
  
  let option = {}
  switch (activeTab.value) {
    // 部门分布（饼图）
    case 'dept':
      option = {
        title: { text: '部门员工分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: {
          bottom: 0,
          left: 'center',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: { fontSize: 12 }
        },
        series: [
          {
            name: '部门人数',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c} ({d}%)'
            },
            emphasis: {
              label: { show: true, fontSize: 14, fontWeight: 'bold' },
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            },
            labelLine: { show: false },
            data: data
          }
        ]
      }
      break

    // 性别分布（饼图）
    case 'gender':
      option = {
        title: { text: '员工性别分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 0, left: 'center', itemWidth: 12, itemHeight: 12 },
        series: [
          {
            name: '性别',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: data.male, name: '男' },
              { value: data.female, name: '女' }
            ],
            label: { show: true, formatter: '{b}: {d}%' },
            emphasis: {
              label: { fontSize: 14, fontWeight: 'bold' },
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            }
          }
        ]
      }
      break

    // 年龄分布（柱状图）
    case 'age':
      option = {
        title: { text: '员工年龄分布', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: [
          {
            type: 'category',
            data: ['20-25', '26-30', '31-35', '36-40', '41+'],
            axisTick: { alignWithLabel: true }
          }
        ],
        yAxis: [{ type: 'value', name: '员工数量' }],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: [
              data.age20_25,
              data.age26_30,
              data.age31_35,
              data.age36_40,
              data.age41Plus
            ],
            itemStyle: {
              color: function (params) {
                const colorList = ['#1E88E5', '#4CAF50', '#FF9800', '#F44336', '#9C27B0']
                return colorList[params.dataIndex]
              }
            }
          }
        ]
      }
      break

    // 状态分布（饼图）
    case 'status':
      option = {
        title: { text: '员工状态分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 0, left: 'center', itemWidth: 12, itemHeight: 12 },
        series: [
          {
            name: '状态',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
            //   { value: data.onDuty, name: '在职' },
            //   { value: data.probation, name: '试用期' },
            //   { value: data.leave, name: '已离职' }
              { value: 111, name: '在职' },
              { value: 222,name: '试用期' },
              { value: 333,name: '已离职' }
            ],
            label: { show: true, formatter: '{b}: {d}%' },
            emphasis: {
              label: { fontSize: 14, fontWeight: 'bold' },
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            }
          }
        ]
      }
      break

    // 部门薪资（柱状图）
    case 'salary':
      option = {
        title: { text: '部门薪资分布', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0, left: 'center', itemWidth: 12, itemHeight: 12 },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: [{ type: 'category', data: data.deptNames, axisTick: { alignWithLabel: true } }],
        yAxis: [{ type: 'value', name: '薪资(元)' }],
        series: [
          {
            name: '薪资总额',
            type: 'bar',
            data: data.totalSalaries,
            itemStyle: { color: '#9C27B0' }
          },
          {
            name: '平均薪资',
            type: 'bar',
            data: data.avgSalaries,
            itemStyle: { color: '#4CAF50' }
          }
        ]
      }
      break

    // 入离职趋势（柱状图）
    case 'trend':
        option = {
            title: { text: '员工入离职趋势', left: 'center' },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: '{b}<br/>入职：{c0} 人<br/>离职：{c1} 人'
            },
            legend: { bottom: 0, left: 'center', itemWidth: 12, itemHeight: 12 },
            grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
            xAxis: [{
                type: 'category',
                data: data.months, // 直接用后端返回的 months 数组
                axisTick: { alignWithLabel: true }
            }],
            yAxis: [{ type: 'value', name: '人数' }],
            series: [
                {
                    name: '入职',
                    type: 'bar',
                    data: data.entryCount, // 直接用后端返回的 entryCount 数组
                    itemStyle: { color: '#4CAF50' }
                },
                {
                    name: '离职',
                    type: 'bar',
                    data: data.leaveCount, // 直接用后端返回的 leaveCount 数组
                    itemStyle: { color: '#F44336' }
                }
            ]
        }
      break
  }
  myChart.setOption(option)
}

// 监听标签/时间范围变化，重新加载数据
watch([activeTab, timeRange], () => {
  getStatsData()
}, { immediate: true }) // 修复9：加 immediate 确保初始化时执行

// 页面挂载时初始化
onMounted(() => {
  initChart()
  getStatsData()
})

// 页面卸载时强制销毁（防止路由跳转残留）
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  // 修复10：移除 resize 监听，防止内存泄漏
  window.removeEventListener('resize', () => {
    if (myChart) myChart.resize()
  })
})
</script>

<style scoped>
/* 整体容器 */
.stats-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 顶部统计卡片组 */
.stats-card-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stats-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.stats-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.stats-icon {
  font-size: 16px;
  color: #666;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stats-desc {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
}

.trend-icon {
  font-size: 12px;
  color: #67C23A;
  margin-right: 4px;
}

/* 图表头部（标签+时间筛选） */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.chart-tabs {
  display: flex;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label {
  font-size: 14px;
  color: #666;
}

/* 图表容器 */
.chart-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-box {
  width: 100%;
  height: 500px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .stats-card-group {
    grid-template-columns: 1fr 1fr;
  }
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .chart-box {
    height: 300px;
  }
}
</style>