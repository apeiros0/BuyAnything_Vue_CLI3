<template>
  <section class="products fixed-margin-top container mt-sm-5">
    <loading :active.sync="isLoading"></loading>
    <div class="row">
      <div class="col-md-3">
        <div class="list-group sticky-top">
          <h2 href="#" class="list-group-item bg-light h4 font-weight-bold">
            分類
          </h2>
          <a
            href="#"
            class="list-group-item list-group-item-action"
            @click.prevent="categoryName = ''"
            :class="{ active: categoryName === '' }"
            >全部商品</a
          >
          <template v-for="(item, index) in filterCategory">
            <a
              href="#"
              class="list-group-item list-group-item-action"
              @click.prevent="categoryName = item"
              :class="{ active: categoryName === item }"
              :key="index"
              >{{ item }}</a
            >
          </template>
        </div>
      </div>
      <div class="col-md-9 mt-3 mt-md-0">
        <div>
          <h1 class="h3 mr-auto" v-if="categoryName === ''">全部商品</h1>
          <h1 class="h3 mr-auto" v-else>{{ categoryName }}</h1>
        </div>

        <div class="row no-gutters">
          <template v-for="item in filterProduct">
            <div class="col-6 col-lg-4 mb-3" :key="item.id">
              <ProductCard :product="item"></ProductCard>
            </div>
          </template>
        </div>
        <div class="d-flex justify-content-end" v-if="categoryName === ''">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '@/components/ProductCard.vue';

export default {
  // 接收網址傳遞過來的參數
  props: ['category'],
  data() {
    return {
      categoryName: '',
    };
  },
  created() {
    this.categoryName = this.$route.query.category || ''; // 如果其他頁面有傳遞 分類 的參數，便使用其值
  },
  methods: {},
  computed: {
    filterProduct() {
      const self = this;
      // 當為 空值 時，便回傳 全部商品 (有分頁)
      if (self.categoryName === '') {
        return self.allProducts;
      }
      // 過濾 分類 相同的產品
      return self.allProducts.filter(
        item => item.category === self.categoryName,
      );
    },
    // allProducts 透過 Header 取得 data
    ...mapGetters('productsModules', ['allProducts', 'filterCategory']),
    ...mapGetters(['isLoading']),
  },
  components: {
    ProductCard,
  },
};
</script>

<style></style>
