<template>
  <v-app  class="custom__bg">
    <Navbar />
    <router-view />
  </v-app>
</template>
<script>
import Navbar from "./components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
};
</script>
<style>
.custom__bg {
  background: #f6f7ff;
}
</style>

