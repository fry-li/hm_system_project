// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 2.实现用户数据新增
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 3.实现用户的数据编辑
export const edituser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 4.实现用户角色分配
export const grantUserRole = (data) => {
  console.log(data)
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

// 5.实现用户数据的删除
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 6.实现用户状态切换
export const updateUserState = (uId, type) => {
  return axios({
    url: `users/${uId}/state/${type}`,
    method: 'put'
  })
}
