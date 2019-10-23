<template>
  <div class="container">
    <Carousel></Carousel>
    <Banner></Banner>
    <Category></Category>
    <NewProducts></NewProducts>
  </div>
</template>

<script>
import Carousel from '@/components/Carousel.vue';
import Banner from '@/components/Banner.vue';
import NewProducts from '@/components/NewProducts.vue';
import Category from '@/components/Category.vue';

export default {
  data() {
    return {};
  },
  methods: {},
  components: {
    Carousel,
    Banner,
    NewProducts,
    Category,
  },
};
</script>

<style></style>
