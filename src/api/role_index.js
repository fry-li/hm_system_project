// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有的用户数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色指定的权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

// 为指定角色授权
export const grantRoleById = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}

// 角色的数据编辑
export const editroles = (id, data) => {
  return axios({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}

// 角色的添加
export const addRoles = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}
