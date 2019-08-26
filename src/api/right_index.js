// 1.引入封装好的axios
import axios from '@/utils/myaxios.js'

// 2.实现权限列表数据获取
export const getAllRight = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
