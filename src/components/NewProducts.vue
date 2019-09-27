<template>
  <section>
    <loading :active.sync="isLoading"></loading>
    <div class="text-center my-4">
      <h2 class="products-title font-weight-bold mb-0">即將上市</h2>
    </div>

    <div class="row no-gutters justify-content-center align-items-center">
      <template v-for="(item, index) in filterNewProduct">
        <div class="col-6 col-lg-3" :key="item.id" v-if="index < 4">
          <ProductCard :product="item"></ProductCard>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '@/components/ProductCard.vue';

export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
  computed: {
    filterNewProduct() {
      const self = this;
      return self.allProducts.filter(item => item.is_enabled !== 1);
    },
    // 透過 Header 取得 allProducts 讓 filterNewProduct 能過濾產品
    ...mapGetters('productsModules', ['allProducts']),
    ...mapGetters(['isLoading'])
  },
  components: {
    ProductCard
  }
};
</script>

<style></style>
