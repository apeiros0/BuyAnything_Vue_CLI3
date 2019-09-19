<template>
  <section>
    <Header></Header>
    <Navbar></Navbar>
    <router-view />
    <Footer></Footer>
  </section>
</template>

<script>
import Header from '@/components/layout/Header.vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';

export default {
  components: {
    Header,
    Navbar,
    Footer,
  },
};
</script>

<style></style>
