import { host } from '../common/config';
import request from '../common/request';

export async function restaurant (){
   const result = await request({
      url:`${host}restaurant/location/-74.0059413,40.7127837`,
      method:'get'
   });
   return result;
}

export async function modify (data){
   const result = await request({
      url:`${host}restaurant`,
      method:'post',
      data
   });
   return result;
}