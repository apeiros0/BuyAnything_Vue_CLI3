import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VeeValidate from 'vee-validate';
import zhTW from 'vee-validate/dist/locale/zh_TW';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import router from './router';
import './bus';
import CurrencyFilter from './filters/currency';
import timeFormatFilter from './filters/timeFormat';

Vue.config.productionTip = false;

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zhTW'
});

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    zhTW
  },
  events: 'change|blur'
});

Vue.component('Loading', Loading);

Vue.filter('currency', CurrencyFilter);
Vue.filter('timeFormat', timeFormatFilter);

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');

// 換頁時，檢查是否有持續登入
router.beforeEach((to, from, next) => {
  // 判斷是否需要驗證
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_API_URL}/api/user/check`;
    // 由於 this.$http 並不在 Vue 中，所以用 axios 取代
    axios.post(api).then((response) => {
      // console.log('check', response.data);
      if (response.data.success) {
        // 檢查成功，換頁
        next();
      } else {
        next({
          // 失敗則跳到登入頁
          path: '/signin'
        });
      }
    });
  } else {
    next();
  }
});
