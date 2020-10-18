<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
                  placeholder="请输入内容"
                  clearable @clear="getGoodsList"
          v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="goodsList"
              border
              stripe>
        <el-table-column
                type="index"
                label="#">
        </el-table-column>
        <el-table-column
                prop="goods_name"
                label="商品名称"
                width="500px">
        </el-table-column>
        <el-table-column
                prop="goods_price"
                label="商品价格(元)">
        </el-table-column>
        <el-table-column
                prop="goods_weight"
                label="食品重量">
        </el-table-column>
        <el-table-column
                prop="add_time"
                label="创建时间">
        </el-table-column>
        <el-table-column
                label="操作"
                width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteGoods(scope.row.goods_id)"></el-button>
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

  </div>
</template>

<script>
  export default {
    name: "Good",
    data(){
      return {
        goodsList:[],
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        total:0,
      }
    },
    created() {
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      async deleteGoods(id){
        const confirm = await this.$confirm('此操作将永久删除该商品,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirm !== 'confirm')
          return this.$message.info('您取消了删除操作！')
        const {data:res} = await this.$http.delete('goods/'+id)
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.getGoodsList()
        this.$message.success('已成功删除该商品')
      }
    }
  }
</script>

<style scoped>

</style>