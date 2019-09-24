import axios from 'axios';

export default {
  namespaced: true,
  state: {
    carts: [],
    total: 0,
    final_total: 0,
  },
  mutations: {
    CARTLOADING(state, payload) {
      state.status.cartLoading = payload;
    },
    CARTLIST(state, payload) {
      state.carts = payload.carts;
      state.total = payload.total;
      state.final_total = payload.final_total;
    },
  },
  actions: {
    getCartList(context) {
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/cart`;
      axios.get(api).then((response) => {
        if (response.data.success) {
          context.commit('CARTLIST', response.data.data);
        }
      });
    },
    addToCart(context, { id, qty }) {
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      return new Promise((resolve) => {
        axios.post(api, { data: cart }).then((response) => {
          if (response.data.success) {
            resolve(response);
            context.dispatch('updateMessage', {
              message: response.data.message,
              status: 'success',
            }, { root: true });
            context.dispatch('getCartList');
          }
        });
      });
    },
    deleteCartItem(context, payload) {
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/cart/${payload}`;
      return new Promise((resolve) => {
        axios.delete(api).then((response) => {
          if (response.data.success) {
            resolve(response);
            // 更新購物車
            context.dispatch('getCartList');
            context.dispatch('updateMessage', {
              message: response.data.message,
              status: 'danger',
            }, { root: true });
          }
        });
      });
    },
  },
  getters: {
    carts(state) {
      return state.carts;
    },
    total(state) {
      return state.total;
    },
    finalTotal(state) {
      return state.final_total;
    },
  },
};
