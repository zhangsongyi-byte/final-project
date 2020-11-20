import * as types from './mutation-type';

const loading = {
   state:{
      showLoading:false
   },
   mutations:{
      /* show loading */
      [types.SHOW_LOADING] (state){
         state.showLoading = true;
      },
      /* hide loading */
      [types.HIDE_LOADING] (state){
         state.showLoading = false;
      }
   }
};

export default loading;