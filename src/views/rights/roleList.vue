<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮添加 -->
    <el-button type="success" @click="showAddDialog">添加角色</el-button>
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
            <el-button type="primary" icon="el-icon-edit" @click="showeditroletDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="delGrantDialog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
    </el-dialog>
    <el-dialog>
    <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
<el-dialog title="编辑角色" :visible.sync="editRoleDialogFormVisible">
  <el-form :model="editRoleForm"  ref="editRoleForm">
    <el-form-item label="角色名称" >
      <el-input v-model="editRoleForm.roleName" autocomplete="off" style="width:250px"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" >
       <el-input v-model="editRoleForm.roleDesc" autocomplete="off" style="width:250px"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogFormVisible">取 消</el-button>
    <el-button type="primary" @click="editroles">确 定</el-button>
  </div>
</el-dialog>
<!-- 添加角色对话框 -->
<el-dialog title="添加角色" :visible.sync="addrolesdialogFormVisible">
  <el-form :model="addRolesForm" ref="addRolesForm">
    <el-form-item label="角色名称" >
      <el-input v-model="addRolesForm.roleName" autocomplete="off" style="width:250px" ></el-input>
    </el-form-item>
    <el-form-item label="角色描述" >
      <el-input v-model="addRolesForm.roleDesc" autocomplete="off" style="width:250px"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addrolesdialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import {getAllRoleList,delRightByRoleId,grantRoleById,editroles,addRoles} from "@/api/role_index.js";
import { getAllRightList } from "@/api/right_index.js";
export default {
  data() {
    return {
      addrolesdialogFormVisible:false,
      addRolesForm:{
        roleName:'',
        roleDesc:''
      },

      editRoleDialogFormVisible:false,
      editRoleForm:{
        id:'',
        roleName:'',
        roleDesc:''
      },
      rules: {
        roleName: [
          {
            required: true,
            trigger: "blur"
          }
        ],
       roleDesc: [
          {
            required: true,
            trigger: "blur"
          }
        ]
      },

      roleId: "",
      cnt: 0,
      defaultProps: {
        label: "authName",
        children: "children"
      },
      grantdialogTableVisible: false,
      roleList: [],
      rightList: [],
      checkedArr: []
    };
  },
  methods: {
    // 添加角色
      async addRoles(){
      let res = await addRoles(this.addRolesForm)
      .then(res=>{
        console.log(res)
        if(res.data.meta.status===201){
          this.$message.success(res.data.meta.msg)
          this.addrolesdialogFormVisible = false
          this.init()
        }else{
          this.$message.error(res.data.meta.msg)
        }
      })
      .catch(exp=>{
        this.$message.error('服务器异常')
      })
      },
    //打开添加角色对话框
      showAddDialog(){
        this.addrolesdialogFormVisible = true
      },
    // 弹出编辑角色对话框
      showeditroletDialog(row){
        this.editRoleDialogFormVisible=true
        console.log(row)
        this.editRoleForm.id=row.id
        this.editRoleForm.roleName=row.roleName
        this.editRoleForm.roleDesc=row.roleDesc
      },
      //获取角色默认数据
        editroles(){
          editroles(this.editRoleForm.id,this.editRoleForm)
           .then(res=>{
          console.log(res)
          if(res.data.meta.status === 200){
            this.editRoleForm=res.data.data 
            this.init()
            this.editRoleDialogFormVisible=false
          }else{
            this.$message.error('获取数据失败')
          }
        })
        .catch(error=>{
          this.$message.error('获取失败')
        })
        },
    async grantRole() {
      let arr = this.$refs.tree.getCheckedNodes();
      // 遍历数组，进行数据的拼接
      let temp = [];
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + "," + arr[i].pid);
      }
      //拼接数组元素再转换为数组
      temp = temp.join(",").split(",");
      //数组去重
      temp = [...new Set(temp)];
      let res = await grantRoleById(this.roleId, temp.join(","));
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message.success("res.data.meta.msg");
        this.grantdialogTableVisible = false;
        this.init();
      } else {
        this.$message.error("res.data.meta.msg");
      }
    },
    //弹出角色授权对话框
    showGrantDialog(row) {
      //为后期角色授权提供正确地获取角色id
      this.roleId = row.id;
      //让树形对话框显示
      this.grantdialogTableVisible = true;
      //深拷贝获取权限列表数据
      this.rightList = [...this.rightList];
      this.checkedArr = [];
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.checkedArr.push(third.id);
              });
            }
          });
        }
      });
    },
    delRight(row, rightId) {
      console.log(row.id, rightId);
      delRightByRoleId(row.id, rightId)
        .then(res => {
          console.log(res);
          row.children = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
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
  // 页面挂载完成后执行
  mounted() {
    this.init();
    //要形成树状结构，传参数'tree'，形成表格结构，传参数'list'
    getAllRightList("tree").then(res => {
      console.log(res);
      this.rightList = res.data.data;
    });
  }
};
</script>

<style>
</style>