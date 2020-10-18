<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="el_row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader expand-trigger="hover" :options="cateList"
                       :props="cascaderProps" v-model="selectKeys"
                       @change="handleChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsDialog = true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editDialog = true">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsDialog = true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editDialog = true">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
              :title="'添加'+titleText"
              :visible.sync="addParamsDialog"
              width="50%" @close="closeAddParams">
        <el-form :model="paramsForm" :rules="paramsFormRules" ref="paramsForm" label-width="60px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="paramsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog
              :title="'修改'+titleText"
              :visible.sync="editDialog"
              width="50%" @close="closeEditParams">
        <el-form :model="editForm" :rules="paramsFormRules" ref="editForm" label-width="60px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editData()">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Params",
    created() {
      this.getCategoriesList()
    },
    data(){
      return {
        cateList:[],
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        selectKeys:[],
        activeName:'many',
        manyTableData:[],
        onlyTableData:[],
        addParamsDialog:false,
        editDialog:false,
        paramsForm:{
          attr_name:''
        },
        editForm:{
          attr_name:''
        },
        paramsFormRules:{
          attr_name:[{required: true, message: '请输入参数名称', trigger: 'blur'}],
          attr:[{required: true, message: '请输入属性名称', trigger: 'blur'}]
        }
      }
    },
    methods:{
      async getCategoriesList(){
        const {data:res} = await this.$http.get('categories')
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.cateList = res.data
      },
      handleChange(){
        this.getParamsData()
      },
      handleClick(){
        this.getParamsData()
      },
      async getParamsData(){
        if(this.selectKeys.length === 3){
          const {data:res} = await this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:this.activeName}})
          if(res.meta.status != 200) return this.$message.error(res.meta.msg)
          console.log(res.data)
          if(this.activeName === 'many')
            this.manyTableData = res.data
          else this.onlyTableData = res.data
        }
      },
      closeAddParams(){
        this.$refs.paramsForm.resetFields()
      },
      closeEditParams(){
        this.$refs.editForm.resetFields()
      },
      addData(){
        this.$refs.paramsForm.validate(async vaild => {
          if(!vaild) return
          const {data:res} = await this.$http.post('categories/'+this.cateId+'/attributes', {attr_name:this.paramsForm.attr_name,attr_sel:this.activeName})
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加'+this.titleText+'成功！')
          //关闭对话框
          this.addParamsDialog = false
          //刷新数据
          this.getParamsData()
        })
      },
      editData(){
        this.$refs.editForm.validate(async vaild => {
          if(!vaild) return
          const {data:res} = await this.$http.post('categories/'+this.cateId+'/attributes', {attr_name:this.paramsForm.attr_name,attr_sel:this.activeName})
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加'+this.titleText+'成功！')
          //关闭对话框
          this.addParamsDialog = false
          //刷新数据
          this.getParamsData()
        })
      }
    },
    computed:{
      //控制按钮 禁用/启用 状态
      isBtnDisabled(){
        if(this.selectKeys.length !== 3)
          return true
        return false
      },
      cateId(){
        if(this.selectKeys.length === 3)
          return this.selectKeys[2]
        return null
      },
      titleText(){
        if(this.activeName === 'many')
          return '动态参数'
        else return '静态属性'
      }
    }
  }
</script>

<style lang="less" scoped>
  .el_row{
    margin: 15px 0;
  }
</style>