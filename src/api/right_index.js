// 1.引入封装好的axios
import axios from '@/utils/myaxios.js'

// 2.实现权限列表数据获取
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 3.获取左侧菜单权限
export const getLeftMenu = (type) => {
  return axios({
    url: 'menus'
  })
}
