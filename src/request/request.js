import axios from 'axios'
// TODO:拦截器的写法

import {ElMessage} from 'element-plus'
import router from '@/router'

// 创建请求实例
const baseURL = '/api/user'
const instance = axios.create({ baseURL })
// 跨域问题


// 添加响应拦截器 在后端返回给前端数据之前执行 
instance.interceptors.response.use(
  response => {
    const res = response.data
    // 判断业务状态码
    if (res.code === 200) {
      return res
    }

    // 操作失败
    ElMessage.error(res.msg || '服务异常')
    console.log('API Error Response:', res)

    // 异步操作的状态转换为失败
    return Promise.reject(res)
  },
  error => {
    // 处理网络错误
    if (!error.response) {
      ElMessage.error('网络异常，请检查网络连接')
      return Promise.reject(error)
    }

    // 处理HTTP状态码
    switch (error.response.status) {
      case 401:
        ElMessage.error('请先登录')
        router.push('/login')
        break
      case 403:
        ElMessage.error('没有权限访问')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      default:
        ElMessage.error('服务异常')
    }

    return Promise.reject(error)
  }
)


export default instance;