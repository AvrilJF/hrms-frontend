import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端接口前缀（必须和后端一致）
  timeout: 10000, // 延长超时时间，避免请求阻塞
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
//http://localhost:8080/api/admin/stats/employeeStats
//http://localhost:8080/api/admin/stats/age
// http://localhost:8080/api/admin/stats/status
// http://localhost:8080/api/admin/stats/dept
// http://localhost:8080/api/admin/stats/gender
// http://localhost:8080/api/admin/stats/salary
// http://localhost:8080/api/admin/stats/trend



// 请求拦截器
request.interceptors.request.use(
  config => {
    console.log('请求参数：', config) // 打印请求，方便排查
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('响应数据：', response.data) // 打印响应，方便排查
    return response.data
  },
  error => {
    console.error('响应错误：', error)
    ElMessage.error('接口请求失败：' + (error.message || '网络异常'))
    return Promise.reject(error)
  }
)

export default request