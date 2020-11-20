import Vue from 'vue';
import Vuex from 'vuex';

import restaurant from './restaurant';
import loading from './loading';
import tag from './tag';
import menu from './menu';
import login from './login';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
   },
   mutations: {
   },
   actions: {
   },
   modules: {
      loading,
      tag,
      menu,
      restaurant,
      login
   }
});