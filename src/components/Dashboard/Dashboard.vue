<template>
  <section>
    <Navbar></Navbar>
    <Alert></Alert>
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <Sidebar></Sidebar>
        </nav>
        <div class="col-md-10 ml-auto">
          <main role="main">
            <router-view></router-view>
          </main>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import Alert from './AlertMessage.vue';

export default {
  components: {
    Navbar,
    Sidebar,
    Alert,
  },
};
</script>

<style></style>
