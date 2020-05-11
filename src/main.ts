import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueLazyLoad from 'vue-lazyload'
import '@/assets/svg.js'
Vue.use(VueLazyLoad, {
  loading: require('./assets/default.png'),
  error: require('./assets/default.png')
})
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
