import Vue from 'vue';
import VueRouter from 'vue-router';
import _ from 'lodash';
import { getStorage } from '../common/utils';

Vue.use(VueRouter);

const routes = [
   {
      path:'/',
      name:'/',
      redirect:'/admin/restaurant'
   },
   {
      path:'/login',
      name:'Login',
      component:()=>import('../views/Login/Login.vue'),
      /* 进入login页面之前判断是否有用户登录信息，如果有则跳转到restaurant页面 */
      beforeEnter: (to, from, next) => {
         if(_.get(getStorage('userInfo'),'role')){
            next({ path:'/admin/restaurant' });
         }else{
            next();
         }
      }
   },
   {
      path:'/admin',
      name:'Admin',
      component:()=>import('../views/Admin/Admin.vue'),
      redirect:'/admin/restaurant',
      children:[
         {
            path:'restaurant',
            name:'Restaurant',
            component:()=>import('../components/Restaurant/Restaurant.vue')
         },
         {
            path:'menu',
            name:'Menu',
            component:()=>import('../components/Menu/Menu.vue')
         },
         {
            path:'order',
            name:'Order',
            component:()=>import('../components/Order/Order.vue'),
            /* 进入order页面之前检测登录身份是否为游客，游客只有查看menu和restaurant的权限，无法进入order页面 */
            beforeEnter: (to, from, next) => {
               if(_.get(getStorage('userInfo'),'role') === 'visitor'){
                  next({ path:'/admin/restaurant' });
               }else{
                  next();
               }
            }
         }
      ]
   }
];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

export default router;

/* 路由守卫检测登录态 */
router.beforeEach((to, from, next) => {
   if(to.path === '/admin/order'){
      /* order页面需要检测是否登录 */
      if(_.get(getStorage('userInfo'),'role')){
         next();
      }else{
         next({ path:'/login' });
      }
   }else{
      next();
   }
});