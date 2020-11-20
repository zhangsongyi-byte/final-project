<template>
  <div>
    <el-container>
      <el-aside
        width="200px"
        :style="{ width: isCollapse ? '65px' : '' }"
      >
        <div class="img-container">
          <img
            src="../../assets/logo.png"
            alt=""
            class="logo-image"
          >
        </div>

        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          text-color="#333"
          :style="{ height: isCollapse ? '600px' : '' }"
        >
          <router-link to="/admin/restaurant">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span
                slot="title"
              >
                餐馆
              </span>
            </el-menu-item>
          </router-link>
          <router-link to="/admin/menu">
            <el-menu-item index="2">
              <i class="el-icon-document"></i>
              <span
                slot="title"
              >
                菜单
              </span>
            </el-menu-item>
          </router-link>
          <router-link to="/admin/order">
            <el-menu-item index="3">
              <i class="el-icon-s-order"></i>
              <span
                slot="title"
              >
                订单
              </span>
            </el-menu-item>
          </router-link>
        </el-menu>
        <div class="radio-btn">
          <el-radio-group
            v-model="isCollapse"
            style="margin-bottom : 20px;"
          >
            <el-radio-button
              v-if="isCollapse"
              :label="false"
            >
              <span>&gt;</span>
            </el-radio-button>
            <el-radio-button
              :label="true"
            >
              <div>
                <span>&lt;</span>
              </div>
            </el-radio-button>
          </el-radio-group>
          <button
            class="logout-btn"
            @click="logout"
          >
            登出
          </button>
        </div>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
              Admin
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="main-container">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
/* eslint-disable */
export default {
  name:"App",
  data() {
    return {
      isCollapse:true
    }
  },
  methods: {
    ...mapActions(['clearUserInfo']),
    /* 登出，清除浏览器中的用户信息 */
    logout(){
      this.clearUserInfo()
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="scss">
*{
  padding : 0;
  margin : 0;
}
.el-header {
    line-height : 60px;
    color : #333;
    text-align : center;
    background-color : #B3C0D1;
  }
  .el-aside {
    height : 100vh;
    // line-height : 200px;
    color : #333;
    // text-align : center;
    background-color : #D3DCE6;
  }
  
  .el-main {
    // line-height : 160px;
    color : #333;
    // text-align : center;
    background-color : #E9EEF3;
  }
  
  body > .el-container {
    margin-bottom : 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height : 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height : 320px;
  }

.img-container{
    margin : 20px auto;
}
.logo-image {
  width : 60px;
  height : 60px;
}
.el-menu {
  position : relative;
  min-height : 600px;
  padding-left : 0;
  margin : 0;
  list-style : none;
  background-color : #FFF;
  border-right : solid 1px #e6e6e6;
}
.el-radio-button__inner {
    background-color :  #D3DCE6!important;
    border : none;
}
  el-menu{
    height : 600px;
  }

  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color : #333;
    background-color : #D3DCE6;
    border : none;
    box-shadow : -1px 0 0 0 #D3DCE6;
}

.main-container{
  width : 100%;
  height : 90%;
  margin : 30px auto;
}
a{
  text-decoration : none;
}
.logout-btn{
  width : 50px;
  height : 35px;
  color : #333;
  background-color : #ccc;
  border : 1px #eee solid;
  outline : none;
}
</style>