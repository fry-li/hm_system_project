<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-input
      placeholder="请输入内容"
      v-model="userobj.query"
      class="input-with-select"
      style="width:300px;margin-right:10px"
      @keydown.enter.native="init"
    >
      <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
    </el-input>
    <el-button type="success" @click="addDialogFormVisible = true">添加用户</el-button>
    <!-- 表格显示区域 -->
    <el-table border :data="userList" style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="250"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="350"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='changeState(scope.row.id,scope.row.mg_state)'></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click='deluser(scope.row.id)'></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
       @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4, 5]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'80px'" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'80px'" :rules="rules" ref="editForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" autocomplete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色分配对话框 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'80px'">
        <el-form-item label="用户名:">
          <span>{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsers, addUser, edituser,grantUserRole,delUserById, updateUserState} from "@/api/user_index.js";
import {getAllRoleList} from '@/api/role_index.js'
export default {
  data() {
    return {
      roleList: [],
      grantDialogFormVisible: false,
      grantForm: {
        username: "",
        //用户id
        id: "",
        //角色id
        rid: ""
      },
      editDialogFormVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      addDialogFormVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      total: 0,
      status: true,
      userList: [],
      userobj: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            // 添加正则表达式
            pattern: /\w+[@]\w+[.]\w+/,
            message: "请输入合法的电子邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            // 添加正则表达式
            pattern: /^1\d{10}$/,
            message: "请输入合法的手机号",
            trigger: "blur"
          }
        ]
      }
    };
  },

  //方法
  methods: {
    // 实现用户状态切换
    changeState(id,type){
      updateUserState(id,type)
      .then(res=>{
       if(res.data.meta.status ===200){
          this.$message({
          type:'success',
          message:'修改状态成功'
        })
        this.init()
       }else{
         this.$message({
           type:'error',
           message:res.data.meta.msg
         })
       }
      })
      .catch(()=>{
        this.$messege({
          type:'error',
          message:'修改状态失败'
        })
      })
    },
    //根据id删除用户数据
    deluser(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=>{
        delUserById(id)
        .then(res=>{
          if(res.data.meta.status ===200){
            this.$message.success({
              type:'success',
              message:'删除成功'
            })
            this.init()
          }else{
            this.$message({
              type:'error',
              message:res.data.data.msg
            })  
          }
        })
        .catch(()=>{
          this.$message({
            type:'error',
            message:'删除失败'
          })
        })
      })
      .catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })
    },

    // 弹出角色分配对话框
    showGrantDialog(row) {
      this.grantDialogFormVisible = true;
      console.log(row);
      this.grantForm.username = row.username;
      this.grantForm.id = row.id;
      this.grantForm.rid = row.rid;
    },
    //实现角色分配
    grantUser() {
      console.log(this.grantForm);
      //判断用户是否选择了角色
      if (this.grantForm.rid) {
        console.log(this.grantForm)
        grantUserRole(this.grantForm)
          .then(res => {
            console.log(res);
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg);
              this.grantDialogFormVisible = false;
              this.init();
            }
          })
          .catch(() => {
            this.$message.success("角色分配失败");
          });
      } else {
        this.$message.error("请选择角色");
      }
    },
    
    // 实现用户编辑
    edituser() {
      edituser(this.editForm)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.$message.success("编辑用户成功");
            this.init();
            this.editDialogFormVisible = false;
            //清空表单
            this.$refs.editForm.resetFields();
          }
        })
        .catch(() => {
          this.$message.success("编辑用户失败");
        });
    },
    //弹出编辑对话框
    showEditDialog(row) {
      this.editDialogFormVisible = true;
      // console.log(row);
      this.editForm.id = row.id;
      this.editForm.username = row.username;
      this.editForm.email = row.email;
      this.editForm.mobile = row.mobile;
    },
    //新增用户
    add() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              console.log(res);
              if (res.data.meta.status === 201) {
                this.$message.success("添加用户成功");
                this.init();
                this.addDialogFormVisible = false;
                //清空表单数据
                this.$refs.addForm.resetFields();
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.success("用户新增失败");
            });
        } else {
          this.$message.warning("请输入所有必填的数据");
        }
      });
    },
    //切换size下拉列表时触发的事件
    handleSizeChange(val) {
      this.userobj.pagesize = val;
      this.init();
    },
    //切换当前页码页码时触发
    handleCurrentChange(val) {
      this.userobj.pagenum = val;
      this.init();
    },
    //数据获取
    init() {
      getAllUsers(this.userobj)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users;
            //获取记录总数
            this.total = res.data.data.total;
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg);
            this.$router.push({ name: "login" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.init();
    //加载角色列表数据  
    getAllRoleList()
    .then(res =>{
      console.log(res)
      if(res.data.meta.status === 200){
        this.roleList=res.data.data
      }
    })
    .catch(err =>{
      console.log(err)
    })
  }
};
</script>

<style>
</style>