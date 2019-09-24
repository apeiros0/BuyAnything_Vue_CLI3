import Vue from 'vue';
import Vuex from 'vuex';
import productsModules from './store/products';
import cartsModules from './store/carts';


Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.VUE_APP_NODE_ENV !== 'production',
  state: {
    isLoading: false,
    pagination: {},
    messages: [],
  },
  mutations: {
    ISLOADING(state, payload) {
      state.isLoading = payload;
    },
    PAGES(state, payload) {
      state.pagination = payload;
    },
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
    getPagination(context, payload) {
      context.commit('PAGES', payload);
    },
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
    pagination(state) {
      return state.pagination;
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
