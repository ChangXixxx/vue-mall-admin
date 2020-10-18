<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCate">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="cateList"
              style="width: 100%;margin-bottom: 20px;"
              row-key="cat_id"
              border
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" sortable width="180"></el-table-column>
        <el-table-column prop="name" label="是否有效" sortable width="180">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" v-if="scope.row.cat_deleted === false"></el-button>
            <el-button type="info" icon="el-icon-close" v-else></el-button>
          </template>

        </el-table-column>
        <el-table-column prop="address" label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
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
      <el-dialog
              title="添加分类"
              :visible.sync="addCateDialog"
              width="50%" @close="closeAddCate">
        <el-form :model="cateForm" :rules="cateFormRules" ref="cateForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="cateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader expand-trigger="hover" :options="parentCateList"
                         :props="cascaderProps" v-model="selectKeys"
                    @change="handleChange" clearable change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog
              title="修改分类名称"
              :visible.sync="editCateDialog"
              width="50%">
        <el-form :model="editForm" :rules="cateFormRules" ref="editForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCate1">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Categories",
    data(){
      return {
        queryInfo: {
          type:3,
          pagenum:1,
          pagesize:5
        },
        cateList:[],
        total:0,
        addCateDialog:false,
        editCateDialog:false,
        cateForm:{
          cat_name:'',
          cat_pid:0,
          cat_level:0
        },
        cateFormRules:{
          cat_name:[
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        parentCateList:[],
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        selectKeys:[],
        editId:0,
        editForm:{
          cat_name:''
        }
      }
    },
    created() {
      this.getCategoriesList()
    },
    methods:{
      async getCategoriesList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.cateList = res.data.result
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCategoriesList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCategoriesList()
      },
      async showCate(){
        this.addCateDialog = true
        const {data:res} = await this.$http.get('categories', {params:{type:2}})
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.parentCateList = res.data
      },
      addCate(){
        this.$refs.cateForm.validate(async vaild => {
          if(!vaild) return
          const {data:res} = await this.$http.post('categories', this.cateForm)
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加分类成功！')
          //关闭对话框
          this.addCateDialog = false
          //刷新数据
          this.getCategoriesList()
        })
      },
      handleChange(){
        if(this.selectKeys.length > 0){
          this.cateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
          this.cateForm.cat_level = this.selectKeys.length
          return
        } else {
          this.cateForm.cat_pid = 0
          this.cateForm.cat_level = 0
        }
      },
      closeAddCate(){
        this.$refs.cateForm.resetFields()
        this.selectKeys = []
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      },
      editCate(id){
        this.editCateDialog = true
        this.editId = id
      },
      editCate1(){
        this.$refs.editForm.validate(async vaild => {
          if(!vaild) return
          console.log(this.editForm.cat_name)
          const {data:res} = await this.$http.put('categories/'+this.editId,
                                             {cat_name:this.editForm.cat_name})
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('编辑分类成功！')
          //关闭对话框
          this.editCateDialog = false
          //刷新数据
          this.getCategoriesList()
        })
      },
      async deleteCate(id){
        const confirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirm !== 'confirm')
          return this.$message.info('您取消了删除操作！')
        const {data:res} = await this.$http.delete('categories/'+id)
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.getCategoriesList()
        this.$message.success('已成功删除该分类')
      }
    }
  }
</script>

<style scoped>

</style>