import * as types from './mutation-type';
import { login } from '../request/login';
import { setStorage,getStorage } from '../common/utils';

const state = {
   userInfo:getStorage('userInfo') || {}
};

const mutations = {
   [types.SAVE_USERINFO] (state,data){
      state.userInfo = data;
   },
   [types.CLEAR_USERINFO] (state){
      state.userInfo = null;
   }
};

const actions = {
   async saveUserInfo ({ commit },{ username,password }){
      const user = await login({ username,password });
      commit(types.SAVE_USERINFO,user);
      setStorage('userInfo',user);
   },
   async clearUserInfo ({ commit }){
      setStorage('userInfo',null);
      commit(types.CLEAR_USERINFO);
   }
};

export default{
   state,
   mutations,
   actions
};