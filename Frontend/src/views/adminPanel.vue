<template>
  <v-container>
    <h1 class="text-center">AdminPanel View</h1>
    <br />
    <v-btn @click="changeSite">Zurück zur Karte</v-btn>
    <adminPanel />
  </v-container>
</template>

<script>
import adminPanel from '../components/adminPanel';
export default {
  name: 'AdminPanel',
  components: { adminPanel },
  data() {
    return {};
  },
  methods: {
    changeSite() {
      this.$router.push('/adminMap');
    },
  },
};
</script>

<style></style>
