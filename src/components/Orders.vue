<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
                  placeholder="请输入内容"
                  clearable @clear="getOrdersList"
                  v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="">
            </el-button>
            <el-button type="success" icon="el-icon-map-location" size="mini"
                       @click="checkInfo(scope.row.order_id)">
            </el-button>
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
            title="物流进度"
            :visible.sync="dialogVisible"
            width="50%">
      <el-timeline>
        <el-timeline-item
                v-for="(activity, index) in ordersList"
                :key="index"
                :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Orders",
    created() {
      this.getOrdersList()
    },
    data(){
      return {
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        total:0,
        ordersList:[],
        dialogVisible:false
      }
    },
    methods:{
      async getOrdersList(){
        const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.ordersList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getOrdersList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getOrdersList()
      },
      async checkInfo(id){
        this.dialogVisible = true
        console.log(id)
        const {data:res} = await this.$http.get('/kuaidi/'+id)
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        console.log(res.data)
      }
    }
  }
</script>

<style scoped>

</style>