// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有的用户数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
