<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="backLogin">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width=" isShow ? '64px':'200px'">
<!--        折叠条-->
        <div class="toggle-button" @click="toggleClick">| | |</div>
        <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF"
                unique-opened
                :collapse="isShow"
                :collapse-transition="false"
                :router="true"
                :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
<!--            一级菜单-->
            <template slot="title">
<!--              一级菜单的图标-->
              <i :class="subMenuIcon[item.id]"></i>
<!--              一级菜单的文本-->
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item
                    :index="'/'+child.path"
                    v-for="child in item.children"
                    :key="child.id"
                    @click="saveNavStatus('/'+child.path)">
              <template slot="title">
                <!--              二级菜单的图标-->
                <i class="el-icon-menu"></i>
                <!--              二级菜单的文本-->
                <span>{{child.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return {
        menuList:[],
        subMenuIcon:{
          // 键值对
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        },
        isShow:false,
        activePath:''
      }
    },
    // 从服务器获取列表信息
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
      backLogin(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList(){
        const {data:res} = await this.$http.get('menus')
        if(res.meta.status != 200) return this.$.error(res.meta.msg)
        this.menuList = res.data
      },
      toggleClick(){
        this.isShow = !this.isShow
      },
      saveNavStatus(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style lang="less" scoped>
  .home_container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
    img{
      width: 50px;
      height: 50px;
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: 0px;
    }
  }
  .el-main{
    background-color: #EAEDF1;
  }
  .iconfont{
    margin-right: 15px;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
</style>