<template>
  <v-container>
    <v-row>
      <v-col class="text-right">
        <v-btn outlined text class="red accent-3 justify-right" @click="abmelden"> Abmelden </v-btn>
      </v-col>
    </v-row>

    <!--Google Maps Component-->
    <GoogleMap />
  </v-container>
</template>

<script>
import axios from 'axios';
import GoogleMap from '../components/Google_Maps';
export default {
  name: 'Map',
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
    };
  },
  components: { GoogleMap },
  methods: {
    async abmelden() {
      await axios.get(`${this.serverAdress}/abmelden`);
      this.$router.push('/');

      localStorage.removeItem(`login`);

      //Kunden aus Store löschen
      this.$store.dispatch('LogoutKunde');
    },
  },
  mounted() {
    console.log(this.$store.state.aktiverUser);
  },
};
</script>

<style></style>
