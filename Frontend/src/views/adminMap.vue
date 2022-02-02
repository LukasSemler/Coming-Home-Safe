<template>
  <v-container>
    <h1 class="text-center">Admin Map View</h1>
    <br />
    <adminMap />
  </v-container>
</template>

<script>
import adminMap from '../components/adminMap.vue';
export default {
  name: 'Admin-Map',
  components: { adminMap },
  data() {
    return {};
  },
};
</script>

<style></style>
