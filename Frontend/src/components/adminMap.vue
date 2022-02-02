<template>
  <v-container>
    <v-container>
      <h2 class="text-center">Watch Position</h2>
      <v-btn @click="backToMain">Back to Login/Register</v-btn>
      <!-- <GmapAutocomplete @place_changed="setPlace" />
      <button @click="addMarker">Add</button> -->
    </v-container>
    <br />
    <GmapMap :center="center" :zoom="12" style="width: 100%; height: 800px">
      <GmapMarker :key="index" v-for="(m, index) in locations" :position="m" />
    </GmapMap>

    <br />
    <br />
  </v-container>
</template>

<script>
export default {
  name: 'GoogleMap',
  data() {
    return {
      center: {
        lat: 48.2094881,
        lng: 16.3072147,
      },
      currentPlace: null,
      markers: [],
      locations: [],
      loc: [],

      text: 'Start Tracker',
      started: false,
      interval: '',

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',
      locationSingleUser: [],
    };
  },
  mounted() {
    this.ws = new WebSocket(this.ws_serverAdress);
    this.ws.onmessage = ({ data }) => {
      let bekommen = JSON.parse(data);
      console.log(bekommen);

      this.locations = [
        {
          lat: bekommen.lat,
          lng: bekommen.lng,
          lable: 'Current Position User 1',
        },
      ];
    };
  },
  methods: {
    backToMain() {
      this.$router.push({
        name: 'Login_Register',
      });
    }, //
  },
};
</script>
