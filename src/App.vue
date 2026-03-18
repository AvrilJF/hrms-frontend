<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* 全局重置 + 核心自适应 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 根容器：移除强制100vw，改用100%，允许横向滚动（而非隐藏） */
html, body, #app {
  height: 100%;
  width: 100% !important; /* 改为100%（基于父容器），而非100vw（视口） */
  overflow-x: auto; /* 溢出时显示滚动条，而非hidden */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
}

/* 页面容器：移除100vw，改用100%，padding计入宽度 */
.app-container {
  width: 100% !important; /* 基于父容器（#app）的100% */
  height: 100%;
  padding: 15px 20px !important;
  margin: 0 !important;
  box-sizing: border-box; /* 已全局设置，可保留 */
  overflow-x: auto; /* 溢出时显示滚动条，而非hidden */
}

/* 表格核心：保留100%宽度，表格布局改为固定（避免列宽混乱） */
.el-table {
  width: 100% !important;
  table-layout: fixed !important; /* 改为fixed，配合列宽分配 */
  font-size: 13px !important;
  border: none !important;
}
.el-table__header, .el-table__body {
  width: 100% !important;
}
/* 单元格：取消强制nowrap，允许换行/溢出显示省略号 */
.el-table th, .el-table td {
  padding: 8px 5px !important;
  white-space: normal !important; /* 允许换行 */
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  line-height: 1.2 !important;
  border-right: 1px solid #ebeef5 !important;
  /* 可选：给固定列宽，避免列宽不均 */
  /* width: 120px !important; */
}
/* 最后一列无右边框，避免溢出 */
.el-table th:last-child, .el-table td:last-child {
  border-right: none !important;
}

/* 搜索栏：保留flex-wrap，调整宽度计算（gap由flex自动处理） */
.search-bar {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 10px !important;
  align-items: center !important;
  margin-bottom: 15px !important;
  width: 100% !important;
}
/* 搜索框：移除calc减10px，改用flex-basis + flex-shrink */
.search-bar .el-input, .search-bar .el-select {
  flex: 1 1 calc(18% - 10px) !important; /* 允许收缩/拉伸 */
  min-width: 150px !important;
  max-width: 220px !important;
  width: auto !important; /* 取消固定宽度，改用flex */
}
.search-bar .el-button {
  flex: 0 1 calc(10% - 10px) !important; /* 不拉伸，仅收缩 */
  min-width: 80px !important;
  max-width: 120px !important;
  width: auto !important;
}

/* 分页：移除100%强制宽度，仅保留布局 */
.el-pagination {
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  margin-top: 15px !important;
  padding-right: 5px !important;
  /* 移除width:100% !important; 避免与padding叠加溢出 */
}

/* 卡片：占满页面宽度 */
.el-card {
  width: 100% !important;
  height: auto !important;
  margin-bottom: 10px !important;
}

/* 响应式适配：不同屏幕比例自动调整 */
@media screen and (max-width: 1440px) {
  .app-container {
    padding: 10px 15px !important;
  }
  .search-bar .el-input, .search-bar .el-select {
    width: calc(20% - 8px) !important;
  }
  .search-bar .el-button {
    width: calc(12% - 8px) !important;
  }
  .el-table th, .el-table td {
    padding: 6px 3px !important;
    font-size: 12px !important;
  }
}

@media screen and (max-width: 1200px) {
  .search-bar .el-input, .search-bar .el-select {
    width: calc(25% - 8px) !important;
  }
  .el-table {
    font-size: 11px !important;
  }
}

/* 弹窗自适应 */
.el-dialog {
  width: 40% !important;
  max-width: 450px !important;
  min-width: 350px !important;
}
</style>