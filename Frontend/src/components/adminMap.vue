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
      <GmapMarker :key="index" v-for="(m, index) in locationSingleUser" :position="m" />
    </GmapMap>

    <br />
    <h1 class="text-center" v-if="locationSingleUser.length == 0">
      Es sind noch keine User vorhanden
    </h1>
    <h2 class="text-center" v-else>Aktiver User: {{ users.vorname }} {{ users.nachname }}</h2>
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
      users: {},
    };
  },
  created() {
    this.ws = new WebSocket(this.ws_serverAdress);
    this.ws.onmessage = ({ data }) => {
      let bekommen = JSON.parse(data);
      console.log(bekommen);

      if (bekommen.type == 'info') {
        this.locationSingleUser = [];
      } else {
        this.users = bekommen.user;
        this.locationSingleUser = [
          {
            lat: bekommen.lat,
            lng: bekommen.lng,
            lable: 'Current Position User 1',
          },
        ];
        this.$forceUpdate();
      }
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
