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

/* 根容器强制占满视口 */
html, body, #app {
  height: 100%;
  width: 100vw !important; /* 强制等于视口宽度 */
  overflow-x: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
}

/* 页面容器：完全占满视口宽度，无留白 */
.app-container {
  width: 100vw !important; /* 视口宽度 */
  height: 100%;
  padding: 15px 20px !important;
  margin: 0 !important; /* 取消居中，避免留白 */
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 表格核心：100%视口宽度，自动拉伸列 */
.el-table {
  width: 100% !important; /* 等于父容器（视口宽度） */
  table-layout: auto !important; /* 关键：自动分配列宽，充满页面 */
  font-size: 13px !important;
  border: none !important;
}
.el-table__header, .el-table__body {
  width: 100% !important;
}
/* 单元格自动拉伸，充满列宽 */
.el-table th, .el-table td {
  padding: 8px 5px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  line-height: 1.2 !important;
  border-right: 1px solid #ebeef5 !important;
}
/* 最后一列无右边框，避免溢出 */
.el-table th:last-child, .el-table td:last-child {
  border-right: none !important;
}

/* 搜索栏：紧凑布局，不占满行但随页面缩放 */
.search-bar {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 10px !important;
  align-items: center !important;
  margin-bottom: 15px !important;
  width: 100% !important; /* 搜索栏也占满页面宽度 */
}
/* 搜索框：固定比例宽度，随页面缩放 */
.search-bar .el-input, .search-bar .el-select {
  width: calc(18% - 10px) !important; /* 按页面宽度比例分配，永不占满行 */
  min-width: 150px !important;
  max-width: 220px !important;
}
.search-bar .el-button {
  width: calc(10% - 10px) !important;
  min-width: 80px !important;
  max-width: 120px !important;
}

/* 分页：靠右，占满页面宽度 */
.el-pagination {
  width: 100% !important;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  margin-top: 15px !important;
  padding-right: 5px !important;
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