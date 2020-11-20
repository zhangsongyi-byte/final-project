<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="Username"
        prop="username"
      >
        <el-input
          v-model="loginForm.username"
          type="text"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Password"
        prop="password"
      >
        <el-input
          v-model="loginForm.password"
          type="password"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('loginForm')"
        >
          登录
        </el-button>
        <el-button @click="drawer = true">
          显示登录信息
        </el-button>
      </el-form-item>
    </el-form>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
    >
      <template slot="title">
        <span :style="{fontSize: '16px'}">可选用户名</span>
      </template>

      <el-card
        v-for=" item in loginUserInfo"
        :key="item.id"
        shadow="always"
      >
        <p>{{ item.role }}</p>
        <p>username: {{ item.username }}</p>
        <p>password: {{ item.password }}</p>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash';
export default {
   name:'Login',
   data () {
      return {
         loginForm:{
            username:'',
            password:''
         },
         rules:{
            username:[ { required:true,message:'请输入用户名',trigger:true } ],
            password:[ { required:true,message:'请输入密码',trigger:true } ]
         },
         drawer:false,
         loginUserInfo:[
            { role:'管理员',username:'admin',password:'随意' },
            { role:'游客',username:'visitor',password:'随意' },
            { role:'部门员工',username:'employee',password:'随意' },
         ]
      };
   },

   methods: {
      ...mapActions([ 'saveUserInfo' ]),
      submitForm (formName) {
         this.$refs[formName].validate((valid) => {
            if (valid) {
               //  alert('submit!');
            } else {
               console.log('error submit!!');
               return false;
            }
         });
         const roles = [ 'admin','visitor','employee' ];
         if(_.includes(roles,this.loginForm.username)){
            if(this.loginForm.password){
               this.saveUserInfo({
                  username:this.loginForm.username,
                  password:this.loginForm.password
               });
               this.$router.push('/admin');
            }else{
               alert(this.rules.password.message);
            }
         }else{
            alert('请输入正确的用户名');
         }
      }
   },
};
</script>

<style lang="scss" scoped>
.login-container{
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content : center;
    width : 100vw;
    height :100vh;
}
</style>