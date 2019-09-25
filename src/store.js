import Vue from 'vue';
import Vuex from 'vuex';
import productsModules from './store/products';
import cartsModules from './store/carts';


Vue.use(Vuex);

export default new Vuex.Store({
  // 避免在 production 環境中使用嚴謹模式
  strict: process.env.VUE_APP_NODE_ENV !== 'production',
  state: {
    isLoading: false,
    messages: [],
  },
  mutations: {
    ISLOADING(state, payload) {
      state.isLoading = payload;
    },
    // Alert Message
    UPDATEMESSAGE(state, payload) {
      state.messages.push(payload);
    },
    REMOVEMESSAGE(state, payload) {
      state.messages.splice(payload, 1);
    },
    REMOVEMESSAGEWITHTIMING(state, payload) {
      state.messages.forEach((item, i) => {
        if (item.timestamp === payload) {
          state.messages.splice(i, 1);
        }
      });
    },
  },
  actions: {
    // Alert Message
    updateMessage(context, { message, status }) {
      const timestamp = Math.floor(new Date() / 1000);
      const messages = {
        message,
        status,
        timestamp,
      };
      context.commit('UPDATEMESSAGE', messages);
      context.dispatch('removeMessageWithTiming', timestamp);
    },
    removeMessage(context, payload) {
      context.commit('REMOVEMESSAGE', payload);
    },
    removeMessageWithTiming(context, payload) {
      setTimeout(() => {
        context.commit('REMOVEMESSAGEWITHTIMING', payload);
      }, 3000);
    },
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
    messages(state) {
      return state.messages;
    },
  },
  modules: {
    productsModules,
    cartsModules,
  },
});
