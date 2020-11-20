<template>
  <div id="app">
    <router-view />
    <!-- loading组件 -->
    <Loading />
  </div>
</template>

<script>
import Loading from './components/Loading/Loading';
export default {
   name:'App',
   components:{
      Loading
   }
};
</script>

<style lang="scss">
*{
  padding : 0;
  margin : 0;
}
</style>

