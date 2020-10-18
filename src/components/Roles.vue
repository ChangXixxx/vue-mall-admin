<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="rolesList"
              border
              stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children"
                            type="warning" :key="item3.id"
                            closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="400px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showRole(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
              title="添加角色信息"
              :visible.sync="addDialogVisible"
              width="50%"
              @close="closeDialog">
      <span>
        <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="80px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="roleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog
              title="修改角色信息"
              :visible.sync="editDialogVisible"
              width="70%"
              @close="closeEditDialog">
      <span>
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
          <el-form-item label="角色id">
            <el-input v-model="editForm.roleId" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
              title="分配角色权限"
              :visible.sync="addRoleRights"
              width="50%" @close="setRightDialog">
        <el-tree :data="rightList" :props="defaultProps"
                 show-checkbox :default-expand-all="true"
                 node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleRights = false">取 消</el-button>
        <el-button type="primary" @click="addRight">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    created() {
      this.getRolesList()
    },
    data(){
      return {
        rolesList:[],
        roleForm:{
          roleId:'',
          roleName:'',
          roleDesc:''
        },
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ]
        },
        addDialogVisible:false,
        editDialogVisible:false,
        addRoleRights:false,
        editForm:{},
        rightList:[],
        defaultProps:{
          children:'children',
          label:'authName'
        },
        defKeys:[],
        roleId:''
      }
    },
    methods:{
      async getRolesList(){
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.rolesList = res.data
      },
      closeDialog(){
        this.$refs.roleForm.resetFields()
      },
      addRoles(){
        this.$refs.roleForm.validate(async vaild => {
          if(!vaild) return
          const {data:res} = await this.$http.post('roles', {roleName:this.roleForm.roleName,roleDesc:this.roleForm.roleDesc})
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加角色成功！')
          //关闭对话框
          this.addDialogVisible = false
          //刷新数据
          this.getRolesList()
        })
      },
      async showRole(id){
        this.editDialogVisible = true
        const {data:res} = await this.$http.get('roles/'+id)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editForm = res.data
      },
      closeEditDialog(){
        this.$refs.editForm.resetFields()
      },
      editRoles(){
        this.$refs.editForm.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc})
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.editDialogVisible = false
          this.getRolesList()
          this.$message.success('修改角色信息成功')
        })
      },
      async deleteRole(id){
        const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirm !== 'confirm')
          return this.$message.info('您取消了删除操作！')
        const {data:res} = await this.$http.delete('roles/'+id)
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.$message.success('已成功删除该角色')
      },
      async removeRightById(role,rightId){
        const confirm = await this.$confirm('此操作将永久删除该角色的相应权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirm !== 'confirm')
          return this.$message.info('您取消了删除权限操作！')
        const {data:res} = await this.$http.delete('roles/'+role.id+'/rights/'+rightId)
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        role.children = res.data
        this.$message.success('已成功删除该角色权限')
      },
      //通过递归遍历所有节点
      getLeafNode(node,arr){
        if(!node.children) return arr.push(node.id)
        node.children.forEach(item => this.getLeafNode(item,arr))
      },
      async showRights(role){
        this.roleId = role.id
        const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightList = res.data
        this.getLeafNode(role,this.defKeys)
        this.addRoleRights = true
      },
      setRightDialog(){
        this.defKeys = []
      },
      async addRight(){
        const temp = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
        const idStr = temp.join(',')
        const {data:res} = await this.$http.post('roles/'+this.roleId+'/rights',{rids:idStr})
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('已成功分配该权限')
        this.getRolesList()
        this.addRoleRights = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag{
  margin: 7px;
  }
  .el-row{
    border-bottom: #cccccc 1px solid;
  }
</style>