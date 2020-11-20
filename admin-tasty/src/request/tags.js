import request from '../common/request';
import { host } from '../common/config';

export async function tags () {
   const result = await request({
      url:`${host}tags`,
      method:'get'
   });
   return result;
}