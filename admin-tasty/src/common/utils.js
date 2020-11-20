import _ from 'lodash';
/* 将数据存入localstorage里面 */
export function setStorage (key, data) {
   if(!key) return;
   localStorage.setItem(key, JSON.stringify(data));
}

/* 从localstorage中取数据 */
export function getStorage (key) {
   if(!key) return;
   let res = localStorage.getItem(key);
   try {
      return JSON.parse(res);
   } catch (err) {
      return res;
   }
}

/* 权限判断，除了admin身份之外都是无法进行编辑和开关店铺的 */
export function checkRoles (){
   const role = _.get(getStorage('userInfo'),'role');
   return role !== 'admin';
}