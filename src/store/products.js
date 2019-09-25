import axios from 'axios';

export default {
  namespaced: true,
  state: {
    // products: [],
    allProducts: [],
    category: [],
  },
  mutations: {
    // PRODUCTS(state, payload) {
    //   state.products = payload.reverse();
    // },
    ALLPRODUCTS(state, payload) {
      state.allProducts = payload;
    },
    FILTERCATEGORY(state, payload) {
      const category = new Set();
      payload.forEach((item) => {
        // 透過 Set 取出唯一值
        category.add(item.category);
      });
      // 轉換成 array 回傳
      state.category = Array.from(category);
    },
  },
  actions: {
    // getProducts(context, payload) {
    //   const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/products?page=${payload}`;
    //   context.commit('ISLOADING', true, { root: true });
    //   return new Promise((resolve) => {
    //     axios.get(api).then((response) => {
    //       if (response.data.success) {
    //         resolve(response.data);
    //         context.commit('PRODUCTS', response.data.products);
    //         context.commit('ISLOADING', false, { root: true });
    //       }
    //     });
    //   });
    // },
    getAllProducts(context) {
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/products/all`;
      context.commit('ISLOADING', true, { root: true });
      axios.get(api).then((response) => {
        if (response.data.success) {
          context.commit('ALLPRODUCTS', response.data.products);
          context.commit('FILTERCATEGORY', response.data.products);
          context.commit('ISLOADING', false, { root: true });
        }
      });
    },
  },
  getters: {
    // products(state) {
    //   return state.products;
    // },
    allProducts(state) {
      return state.allProducts;
    },
    filterCategory(state) {
      return state.category;
    },
  },
};
