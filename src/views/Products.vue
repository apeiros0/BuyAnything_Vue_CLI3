<template>
  <section class="products fixed-margin-top container mt-sm-5">
    <loading :active.sync="isLoading"></loading>
    <div class="row">
      <div class="col-md-3">
        <section class="list-group sticky-top">
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
        </section>
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
          <Pagination :pagination="pagination" @getPage="getPage"></Pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '@/components/ProductCard.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  // 接收網址傳遞過來的參數
  props: ['category'],
  data() {
    return {
      categoryName: '',
      pagination: {},
      currentPage: 0
    };
  },
  created() {
    this.categoryName = this.$route.query.category || ''; // 如果其他頁面有傳遞 分類 的參數，便使用其值
  },
  methods: {
    getPage(page) {
      this.currentPage = page - 1;
    },
  },
  computed: {
    filterProduct() {
      const self = this;
      const oldProducts = [];
      const newProducts = [];
      // 將 即將上市 產品移至後方
      // 先把全部產品分成 oldProducts 和 newProducts
      self.allProducts.forEach((item) => {
        if (!item.is_enabled) {
          newProducts.push(item);
        } else {
          oldProducts.push(item);
        }
      });
      // 再使用 concat 合併 oldProducts 和 newProducts (concat 會 return new array)
      const products = oldProducts.concat(newProducts);

      // 當為 空值 時，便回傳 全部商品 (有分頁)
      if (self.categoryName === '') {
        // pagination
        const pagination = [];
        products.forEach((item, index) => {
          // 先取得總共有多少頁
          if (index % 10 === 0) {
            pagination.push([]);
          }
          const page = Number.parseInt(index / 10, 10); // 每一頁塞入資料 (使用 index / 每頁多少筆資料 來計算)
          pagination[page].push(item);
        });
        // 分頁內容
        self.pagination = {
          total_pages: pagination.length,
          current_page: self.currentPage + 1, // 當前頁
          has_pre: self.currentPage + 1 !== 1, // 當前頁為第一頁時，回傳 false
          has_next: self.currentPage + 1 !== pagination.length, // 當前頁為最末頁時，回傳 false
          category: null
        };
        return pagination[self.currentPage];
      }
      // 過濾 分類 相同的產品
      return products.filter(item => item.category === self.categoryName);
    },
    // allProducts 透過 Header 取得 data
    ...mapGetters('productsModules', ['allProducts', 'filterCategory']),
    ...mapGetters(['isLoading']),
  },
  components: {
    ProductCard,
    Pagination,
  }
};
</script>

<style></style>
