<template>
  <div class="row mt-5">
    <div class="col-md-6">
      <div class="row">
        <div class="col-12">
          <!-- 使用 query 傳遞參數 /product?category=value -->
          <router-link :to="{ path: '/products', query: { category: filterCategory[0] } }">
            <div
              class="bg-cover product-category-left-top product-category-food d-flex justify-content-center align-items-center"
            >
              <h2 class="h1 font-weight-bold product-category-title text-dark">
                {{ filterCategory[0] }}
              </h2>
            </div>
          </router-link>
        </div>
        <div class="col-12">
          <router-link :to="{ path: '/products', query: { category: filterCategory[1] } }">
            <div
              class="bg-cover product-category-left-bottom product-category-clothes mt-4 d-flex justify-content-center align-items-center"
            >
              <h2 class="h1 font-weight-bold product-category-title text-dark">
                {{ filterCategory[1] }}
              </h2>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-12">
          <router-link :to="{ path: '/products', query: { category: filterCategory[2] } }">
            <div
              class="bg-cover product-category-right-top product-category-furniture mt-4 mt-sm-0 d-flex justify-content-center align-items-center"
            >
              <h2 class="h1 font-weight-bold product-category-title text-dark">
                {{ filterCategory[2] }}
              </h2>
            </div></router-link
          >
        </div>
        <div class="col-12">
          <router-link :to="{ path: '/products', query: { category: filterCategory[3] } }">
            <div
              class="bg-cover product-category-right-bottom product-category-service mt-4 d-flex justify-content-center align-items-center"
            >
              <h2 class="h1 font-weight-bold product-category-title text-dark">
                {{ filterCategory[3] }}
              </h2>
            </div></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    // 由 Header 取得 allProducts，所以能進行過濾
    // 因為資料已經儲存在 vuex 中，所以能透過 Header 取得 allProducts
    ...mapGetters('productsModules', ['filterCategory']),
  },
};
</script>

<style></style>
