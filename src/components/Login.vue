<template>

  <div class="login_container">

    <div class="login_box">
<!--      头像区域-->
      <div class="login_logo">
        <img src="../assets/logo.png" alt="">
      </div>
<!--      表单区域-->
      <div class="login_form">
        <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRule">
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item class="login_button">
            <el-button type="primary" @click="login">提交</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return {
        loginForm:{
          username:'admin',
          password:'123456'
        },
        loginFormRule:{
          username:[
            {required: true, message: '请输入登录名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      reset(){
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        // 表单提交前的预验证
        this.$refs.loginFormRef.validate(async valid => {
          if(!valid) return;
          const {data:ref} = await this.$http.post('login',this.loginForm)
          if(ref.meta.status !== 200) return this.$message.error('登录失败');
          this.$message.success('登录成功');
          window.sessionStorage.setItem("token",ref.data.token)
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .login_logo {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    /*修改超出区域*/
    box-sizing: border-box;
  }
  .login_button{
    display: flex;
    /*将组件移至最右侧*/
    justify-content: flex-end;
  }
</style>