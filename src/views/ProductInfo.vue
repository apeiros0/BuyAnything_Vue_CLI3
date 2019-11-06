<template>
  <div class="container fixed-margin-top mt-sm-4">
    <loading :active.sync="isLoading"></loading>
    <Alert></Alert>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb bg-white px-0">
        <li class="breadcrumb-item">
          <router-link to="/products">商品</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link :to="{ path: '/products', query: { category: product.category } }">{{
            product.category
          }}</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ product.title }}
        </li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-lg-7">
        <div
          class="product-images bg-cover"
          :style="{ backgroundImage: `url(${product.imageUrl})` }"
        ></div>
      </div>
      <div class="col-lg-5">
        <section class="product-info ml-0 ml-lg-3 mt-4 mt-lg-0">
          <h1 class="h2">{{ product.title }}</h1>
          <div class="mt-3">
            <del
              class="h5 mt-1 mb-0 text-secondary d-block"
              v-if="product.origin_price !== product.price"
              >{{ product.origin_price | currency }}</del
            >
            <span class="h1 mt-1 d-block text-primary font-weight-bold">{{
              product.price | currency
            }}</span>
          </div>
          <div class="mt-4 d-flex align-items-end">
            <div>
              <span>數量</span>
              <div class="input-group qty-group mt-1">
                <a
                  class="qty-btn bg-primary"
                  @click.prevent="calculateQty(false)"
                  :class="{ disabled: product.is_enabled !== 1 }"
                  >-</a
                >
                <input
                  type="text"
                  value="1"
                  maxlength="2"
                  class="form-control jq-qty-number qty-input"
                  v-model.number="productQty"
                  :disabled="product.is_enabled !== 1"
                />
                <a
                  class="qty-btn bg-primary"
                  @click.prevent="calculateQty(true)"
                  :class="{ disabled: product.is_enabled !== 1 }"
                  >+</a
                >
              </div>
            </div>
            <span class="ml-3">/ {{ product.unit }}</span>
            <div class="ml-auto">
              <span class="d-block text-left">總計</span>
              <span class="h2 d-block mb-0 text-primary">{{ calculatePrice | currency }}</span>
            </div>
          </div>
          <span class="text-danger mt-2 d-block" v-if="!productQty">請輸入數量</span>
          <div class="mt-5">
            <button
              type="button"
              class="btn btn-warning btn-xl btn-block"
              @click="addToCart"
              :disabled="product.is_enabled !== 1 || status.cartLoading"
            >
              <i class="fas fa-spinner fa-pulse" v-if="status.cartLoading"></i>
              <span v-if="product.is_enabled !== 1">即將上市</span>
              <span v-else>加入購物車</span>
            </button>
          </div>
        </section>
      </div>
    </div>
    <div class="mt-6">
      <section class="mt-2">
        <h2>商品描述</h2>
        <p class="product-description">{{ product.description }}</p>
      </section>
      <section>
        <h2 class="mt-5">特色</h2>
        <p class="product-description">
          在哪裡跌倒，因為沒有人在看你，但房東不准，人若不帥，再暖都是變態。弱者等待時機，我承認自己的結論有九十九次是過錯的。
          我要把雙手身出來讓世人看，我儘管奪患有這麼多土地，逝世後卻連一點塵埃也沒有帶走，你不能以一個握緊的拳頭握手
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Alert from '@/components/Dashboard/AlertMessage.vue';

export default {
  data() {
    return {
      productId: '',
      product: {},
      productQty: 1,
      status: {
        cartLoading: false
      }
    };
  },
  created() {
    // 取得產品 Id
    this.productId = this.$route.params.productId;
    this.getProduct();
  },
  methods: {
    getProduct() {
      const self = this;
      const api = `${process.env.VUE_APP_API_URL}/api/${process.env.VUE_APP_API_PATH}/product/${self.productId}`;
      self.isLoading = true;
      self.$http.get(api).then((response) => {
        if (response.data.success) {
          self.product = { ...response.data.product };
          self.isLoading = false;
        }
      });
    },
    addToCart() {
      const self = this;
      // productQty 為空就什麼都不做
      if (self.productQty === '') return;
      self.status.cartLoading = true;
      self.$store
        .dispatch('cartsModules/addToCart', {
          id: self.productId,
          qty: Math.abs(self.productQty) // 將 負號 轉為正值
        })
        .then(() => {
          self.status.cartLoading = false;
          self.productQty = 1;
        });
    },
    calculateQty(isAdd) {
      // 10 = 十進位
      let num = parseInt($.trim($('.jq-qty-number').val()), 10);
      if (Number.isNaN(num)) {
        num = 1;
      }
      // 超過 99 或小於 1 便不再 增加 或 減少 數量
      if (isAdd) {
        if (num >= 99) return;
        num += 1;
      } else {
        if (num <= 1) return;
        num -= 1;
      }

      $('.jq-qty-number').val(num);
      this.productQty = num;
    }
  },
  computed: {
    // computed 裡不能變更 data 的值，要用 watch 來監控
    calculatePrice() {
      return Math.abs(this.productQty) * this.product.price;
    }
  },
  components: {
    Alert
  },
  watch: {
    // 透過 watch 來監控 productQty
    productQty() {
      // 把非數字和數字 0 的數量都當成 '' (空的，沒有任何東西)
      if (
        Number.isNaN(this.productQty) || typeof this.productQty === 'string' || this.productQty === 0
      ) {
        this.productQty = '';
      }
    }
  }
};
</script>

<style></style>
