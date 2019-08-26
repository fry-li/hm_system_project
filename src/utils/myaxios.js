// 引入axios
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 返回一个默认对象

// 设置拦截器
axios.interceptors.request.use(function (config) {
  let mytoken = localStorage.getItem('itcast_token')
  if (mytoken) {
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 返回一个默认对象
export default axios
