import * as types from './mutation-type';
import { menu,food } from '../request/menu';
import { restaurant } from '../request/restaurant';
import _ from 'lodash';

const state = {
   categories:[],
   foods:[],
   count:0
};

const mutations = {
   [types.SET_MENU] (state,data){
      state.categories = data.name;
      console.log(state);
   },
   [types.LOAD_FOODS] (state,data){
      state.foods = data.foods;
      state.count = data.count;
   }
};

const actions = {
   async getMenu ({ commit }){
      commit(types.SHOW_LOADING);
      try{
         const result = await restaurant();
         const categories = _.map(result.list,(item)=>{
            return{
               id:item._id,
               name:item.name['zh-CN']
            };
         });
         commit(types.SET_MENU,{ name:categories });
      }catch(error){
         console.log('menu store error',error);
      }finally{
         commit(types.HIDE_LOADING);
      }
   },
   async loadFoods ({ commit },{ id,page,limit,keyword }){
      commit(types.SHOW_LOADING);
      try{
         const result = await menu({ id,page,limit,keyword });
         commit(types.LOAD_FOODS,{ foods:result.list,count:result.count });
      }catch(error){
         console.log('menu store loadfoods error',error);
      }finally{
         commit(types.HIDE_LOADING);
      }
   },
   async changeMenu ({ commit },{ id,data }){
      try{
         commit(types.SHOW_LOADING);
         await food({
            id,
            data
         });
      }catch(error){
         console.log('food store error',error);
      }finally{
         commit(types.HIDE_LOADING);
      }
   }
};

export default {
   state,
   mutations,
   actions
};