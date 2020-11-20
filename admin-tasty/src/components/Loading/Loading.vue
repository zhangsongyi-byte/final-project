<template>
  <div
    v-if="showLoading"
    class="loading-container"
  >
    <img
      src="@/assets/loading.gif"
      alt="loading"
      class="loading-image"
    >
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
   name:'Loading',
   computed: {
      ...mapState({
         showLoading: state=>state.loading.showLoading
      })
   },
};
</script>

<style lang="scss">
    .loading{
    &-container{
        position : fixed;
        top :0;
        left : 0;
        z-index : 99;
        display : flex;
        align-items : center;
        justify-content : center;
        width : 100vw;
        height : 100vh;
        background-color : rgba(0, 0, 0, 0.5);
    }

    &-image{
        display : flex;
        flex-direction : column;
        justify-content : center;
        justify-items : center;
        width : 100px;
        height : 100px;
    }
}
</style>
