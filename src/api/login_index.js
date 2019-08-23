// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 实现登陆
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
