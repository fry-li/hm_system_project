<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮添加 -->
    <el-button type="success">成功按钮</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 自己来生成的结构 -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #f00;"
          >
          <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px;">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="delRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'error'"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="delRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">还没有任何的权限，先分配！！</el-col>
          </el-row>
        </template> 
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column prop="level" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRoleList,delRightByRoleId} from "@/api/role_index.js";
export default {
  data() {
    return {
      roleList: []
      // rightList:[]
    };
  },
  methods: {
    delRight(row,rightId){
      console.log(row.id,rightId)
      delRightByRoleId(row.id, rightId)
      .then(res =>{
        console.log(res)
        row.children=res.data.data
      })
      .catch(err=>{
        console.log(err)
      })
    },
    init() {
      //角色列表
      getAllRoleList()
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data;
          } else {
            this.$messsge.error("获取角色列表失败");
          }
        })
        .catch(error => {
          this.$message.error("获取失败");
        });
    }
  },
  mounted(){
    this.init()
  }
};
</script>

<style>
</style>