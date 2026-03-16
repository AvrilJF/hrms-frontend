<template>
  <div class="dashboard-container app-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8" v-for="(item, index) in statsCards" :key="index">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div>
              <p class="stat-label">{{ item.label }}</p>
              <p class="stat-value">{{ item.value }}</p>
            </div>
            <el-avatar :color="item.color" size="medium" :icon="item.icon" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域（修复高度显示异常） -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <h3 class="chart-title">员工数量趋势</h3>
          <!-- 单独设置图表容器类名，保证高度 -->
          <div ref="trendChart" class="trend-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <h3 class="chart-title">部门员工分布</h3>
          <div ref="pieChart" class="pie-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办事项 -->
    <el-row class="todo-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="todo-header">
            <h3>近期待办事项</h3>
            <el-button type="text" size="small">查看全部</el-button>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(todo, index) in todos"
              :key="index"
              :color="todo.color"
              :icon="todo.icon"
            >
              <div class="todo-item">
                <p class="todo-title">{{ todo.title }}</p>
                <p class="todo-desc">{{ todo.desc }}</p>
                <el-tag :type="todo.color" size="small">{{ todo.tag }}</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { User, UserFilled, OfficeBuilding, Money, Check, Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

// 图表容器引用
const trendChart = ref(null)
const pieChart = ref(null)
// 图表实例（全局变量，方便resize和销毁）
let trendChartInstance = null
let pieChartInstance = null

// 统计卡片数据
const statsCards = ref([
  { label: '总员工数', value: 15, icon: User, color: '#409EFF' },
  { label: '在职员工', value: 14, icon: UserFilled, color: '#67C23A' },
  { label: '部门数量', value: 13, icon: OfficeBuilding, color: '#9B59B6' },
  { label: '平均薪资', value: '¥15,600', icon: Money, color: '#E6A23C' },
  { label: '出勤率', value: '96%', icon: Check, color: '#18A058' },
  { label: '本月新入职', value: 3, icon: Plus, color: '#F56C6C' }
])

// 待办事项
const todos = ref([
  { title: '员工合同到期提醒', desc: '3名员工的合同将在30天内到期', tag: '紧急', color: 'error', icon: 'Bell' },
  { title: '新员工入职培训', desc: '2026-03-05 至 2026-03-06', tag: '进行中', color: 'warning', icon: 'Clock' },
  { title: '月度薪资发放', desc: '2026-03-10 前完成', tag: '计划中', color: 'success', icon: 'Check' }
])

// 初始化员工趋势图
const initTrendChart = () => {
  trendChartInstance = echarts.init(trendChart.value)
  trendChartInstance.setOption({
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '在职', type: 'bar', data: [12, 13, 14, 15, 15, 15], itemStyle: { color: '#409EFF' } },
      { name: '入职', type: 'bar', data: [2, 2, 2, 2, 0, 0], itemStyle: { color: '#67C23A' } },
      { name: '离职', type: 'bar', data: [0, 0, 0, 0, 0, 0], itemStyle: { color: '#F56C6C' } }
    ],
    legend: { data: ['在职', '入职', '离职'] },
    // 自适应配置
    responsive: true,
    maintainAspectRatio: false
  })
}

// 初始化部门分布饼图
const initPieChart = () => {
  pieChartInstance = echarts.init(pieChart.value)
  pieChartInstance.setOption({
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'], // 饼图内外半径，避免太小
        data: [
          { value: 40, name: '技术部' },
          { value: 20, name: '市场部' },
          { value: 20, name: '财务部' },
          { value: 20, name: '人力资源部' }
        ],
        label: { 
          formatter: '{b}: {d}%',
          fontSize: 12 // 保证文字大小适中
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        }
      }
    ],
    responsive: true,
    maintainAspectRatio: false
  })
}

// 加载后端统计数据
const loadStats = async () => {
  try {
    const res = await request.get('/admin/api/dashboard/stats')
    statsCards.value = [
      { label: '总员工数', value: res.totalUser, icon: User, color: '#409EFF' },
      { label: '在职员工', value: res.activeUser, icon: UserFilled, color: '#67C23A' },
      { label: '部门数量', value: res.deptCount, icon: OfficeBuilding, color: '#9B59B6' },
      { label: '平均薪资', value: `¥${res.avgSalary.toLocaleString()}`, icon: Money, color: '#E6A23C' },
      { label: '出勤率', value: `${(res.attendanceRate * 100).toFixed(0)}%`, icon: Check, color: '#18A058' },
      { label: '本月新入职', value: res.newHire, icon: Plus, color: '#F56C6C' }
    ]
  } catch (e) {
    ElMessage.error('加载统计数据失败')
    console.error('统计数据加载失败：', e)
  }
}

// 窗口缩放时重新调整图表大小
const resizeCharts = () => {
  if (trendChartInstance) trendChartInstance.resize()
  if (pieChartInstance) pieChartInstance.resize()
}

// 生命周期：挂载时初始化
onMounted(() => {
  loadStats()
  // 确保DOM渲染完成后初始化图表
  setTimeout(() => {
    initTrendChart()
    initPieChart()
  }, 100)
  // 添加窗口缩放监听
  window.addEventListener('resize', resizeCharts)
})

// 生命周期：卸载时销毁实例
onBeforeUnmount(() => {
  if (trendChartInstance) trendChartInstance.dispose()
  if (pieChartInstance) pieChartInstance.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
/* 仪表盘根容器 */
.dashboard-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* 统计卡片样式 */
.stats-row {
  margin-bottom: 20px;
}
.stat-card {
  margin-bottom: 20px;
}
.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.stat-label {
  font-size: 14px;
  color: #999;
  margin: 0;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0 0;
}

/* 图表区域核心修复：固定高度，避免显示异常 */
.chart-row {
  margin-bottom: 20px;
}
.chart-title {
  margin: 0 0 15px;
  font-size: 16px;
  font-weight: 600;
}
/* 图表容器固定高度，最小高度兜底 */
.trend-chart, .pie-chart {
  width: 100%;
  height: 300px; /* 核心：固定高度，解决显示过小问题 */
  min-height: 250px; /* 缩放时最小高度，避免压缩 */
  box-sizing: border-box;
}

/* 待办事项样式 */
.todo-row {
  margin-top: 20px;
}
.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.todo-title {
  font-weight: bold;
  margin: 0;
}
.todo-desc {
  font-size: 12px;
  color: #999;
  margin: 5px 0;
}

/* 覆盖Element UI默认样式，避免冲突 */
:deep(.el-card) {
  height: auto !important;
}
:deep(.el-timeline-item__content) {
  padding-top: 5px;
}
</style>