import { restaurant,modify } from '../request/restaurant';
import * as types from './mutation-type';
import _ from 'lodash';

const state = {
   restList:[]
};

const mutations = {
   [types.SET_REST] (state, data) {
      state.restList = data.list;
   },
   [types.SAVE_REST] (state,data){
      state.restaurant = data.restaurant;
   }
};

const actions = {
   async setRest ({ commit }){
      commit(types.SHOW_LOADING);
      try {
         const { list } = await restaurant();
         const result = _.map(list,(item)=>{
            if(item.closed === undefined || item.closed === null){
               item.isClosed = false;
            }else{
               item.isClosed = true;
            }
            return item;
         });
         commit(types.SET_REST,{ result });
         commit(types.SET_REST,{ list });
      } catch (error) {
         console.log('restaurant error',error);
      }finally{
         commit(types.HIDE_LOADING);
      }
   },

   async modifyRest ({ commit,dispatch },data){
      commit(types.SHOW_LOADING);
      try {
         await modify(data);
      } catch (error) {
         console.log('modify error',error);
      }finally{
         /* 重新刷新数据 */
         await dispatch('setRest');
         commit(types.HIDE_LOADING);
      }
   }
};

export default {
   state,
   mutations,
   actions
};