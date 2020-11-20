import * as types from './mutation-type';
import { tags } from '../request/tags';

const tag = {
   state: {
      tags:[]
   },
   mutations: {
      [types.GET_TAGS] (state,data){
         state.tags = data.list;
      }
   },
   actions: {
      async getTags ({ commit }){
         const result = await tags();
         commit(types.GET_TAGS,result);
      }
   }
};

export default tag;