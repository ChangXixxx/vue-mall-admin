<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
                  placeholder="请输入内容"
                  v-model="queryInfo.query"
                  clearable
                  @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="userList"
              border
              stripe>
        <el-table-column
                type="index"
                label="#">
        </el-table-column>
        <el-table-column
                prop="username"
                label="姓名">
        </el-table-column>
        <el-table-column
                prop="email"
                label="邮箱">
        </el-table-column>
        <el-table-column
                prop="mobile"
                label="电话">
        </el-table-column>
        <el-table-column
                prop="role_name"
                label="角色">
        </el-table-column>
        <el-table-column
                prop="mg_state"
                label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="statusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
                label="操作"
                width="200px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showUser(scope.row.id)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
                         @click="showRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
            title="添加用户信息"
            :visible.sync="dialogVisible"
            width="50%"
            @close="dialogClosed">
      <span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="70%"
            @close="editClose">
      <span>
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="分配角色"
            :visible.sync="addRoleDialog"
            width="50%" @close="closeSelectRole">
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <span>请分配角色:</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Users",
    created() {
      this.getUserList()
    },
    data(){
      var checkEmail = (rule,value,cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      var checkPhone = (rule,value,cb) => {
        const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regPhone.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的电话号码'))
      }
      return {
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:2
        },
        userList:[],
        total:0,
        dialogVisible:false,
        editDialogVisible:false,
        addRoleDialog:false,
        ruleForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator:checkEmail,trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator:checkPhone,trigger: 'blur'}
          ]
        },
        editForm:{},
        userInfo:{},
        roleList:[],
        value:''
      }
    },
    methods:{
      async getUserList(){
        const {data:res} = await this.$http.get('users',{params:this.queryInfo})
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.userList = res.data.users
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
      //  重新发起网络请求
        this.getUserList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async statusChange(data){
        const {data:res} = await this.$http.put(`users/${data.id}/state/${data.mg_state}`)
        if(res.meta.status !== 200){
          date.mg_state = !date.mg_state
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      },
      // 定义对话框关闭的方法 重置表单
      dialogClosed(){
        this.$refs.ruleForm.resetFields()
      },
      //点击确定按钮，添加用户
      addUser(){
        //验证表单是否正确提交
        this.$refs.ruleForm.validate(async vaild => {
          if(!vaild) return
          const {data:res} = await this.$http.post('users',this.ruleForm)
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加用户成功！')
          //关闭对话框
          this.dialogVisible = false
          //刷新数据
          this.getUserList()
        })
      },
      //修改用户信息，通过id查询到当前用户的信息
      async showUser(id){
        this.editDialogVisible = true
        const {data:res} = await this.$http.get('users/'+id)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editForm = res.data
      },
      editClose(){
        this.$refs.editForm.resetFields()
      },
      editUser(){
        this.$refs.editForm.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('修改用户信息成功')
        })
      },
      async deleteUser(id){
        const confirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirm !== 'confirm')
          return this.$message.info('您取消了删除操作！')
        const {data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$message.success('已成功删除该用户')
      },
      async showRole(userInfo){
        this.userInfo = userInfo
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.roleList = res.data
        this.addRoleDialog = true
      },
      async addRole(){
        if(!this.value) return this.$message.error('请选择角色')
        const {data:res} = await this.$http.put('users/'+this.userInfo.id+'/role',{rid:this.value})
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.$message.success('已成功分配角色')
        this.getUserList()
        this.addRoleDialog = false

      },
      closeSelectRole(){
        this.value = ''
        this.userInfo = []
      }
    }
  }
</script>

<style scoped>

</style>