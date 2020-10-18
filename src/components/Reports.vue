<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 750px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
  import ECharts from 'echarts'
  import _ from 'lodash'
  export default {
    name: "Reports",
    data(){
      return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted() {
      const myChart = ECharts.init(document.getElementById('main'))
      const {data:res} = await this.$http.get('reports/type/1')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      const result = _.merge(res.data,this.options)
      console.log(result)
      myChart.setOption(result)
    }
  }
</script>

<style lang="less" scoped>
  .echarts {
    width: 100%;
    height: 100%;
  }
</style>