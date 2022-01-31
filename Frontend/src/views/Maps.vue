<template>
  <v-container> <GoogleMap /> <Tracker /></v-container>
</template>

<script>
import GoogleMap from '../components/Google_Maps';
import Tracker from '../components/Tracker.vue';
export default {
  name: 'Map',
  components: { GoogleMap, Tracker },
};
</script>

<style></style>
