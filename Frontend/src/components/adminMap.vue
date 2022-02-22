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
    <!-- <h2 class="text-center" v-else>Aktiver User: {{ users.vorname }} {{ users.nachname }}</h2> -->

    <v-container v-if="locationSingleUser.length != 0">
      <v-card class="mx-auto" max-width="500" elevation="2">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 mb-1"
              >{{ users.user.vorname }} {{ users.user.nachname }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <b>Persoenliche Infos:</b> {{ users.user.hobbysinteressen }}</v-list-item-subtitle
            >
            <v-list-item-subtitle>
              <b>Aktuelle Adresse: </b> {{ users.adresse }}</v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn class="light-blue" outlined text @click="setFocus"> Show on Map </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-btn class="light-blue" outlined text @click="setFocus2"> Show on Map2 </v-btn>
    <br />
    <br />
  </v-container>
</template>

<script>
import axios from 'axios';

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
      currentPos: null,

      lat: null,
      long: null,
    };
  },
  async created() {
    //Websockets funkionieren nur auf Heroku nicht auf localhost
    // let HOST = location.origin.replace(/^https/, 'wss');
    this.ws = new WebSocket(this.ws_serverAdress);

    this.ws.onmessage = ({ data }) => {
      let bekommen = JSON.parse(data);
      console.log(bekommen);
      this.currentPos = bekommen;

      if (bekommen.type == 'info') {
        this.locationSingleUser = [];
      } else {
        this.users = { user: bekommen.user, adresse: bekommen.adresse };
        this.locationSingleUser = [
          {
            lat: bekommen.lat,
            lng: bekommen.lng,
            lable: 'Current Position User 1',
          },
        ];

        this.lat = bekommen.lat;
        this.long = bekommen.lng;

        //! Geht nicht, weil in Websocket ?
        // const { data } = await axios.get(
        //   `https://api.geoapify.com/v1/geocode/reverse?lat=${bekommen.lat}&lon=${bekommen.long}&apiKey=b40d04c271104006843d3c8dc5c8fd1b`,
        // );

        //*Momentan nicht notwendig
        // console.log(data);
        //Center setzen
        // this.center.lat = this.currentPos.lat;
        // this.center.lng = this.currentPos.lng;
        //this.$forceUpdate();
      }
    };
    if (this.lat != null && this.long != null) {
      console.log('adresse');
      // const { data } = await axios.get(
      //   `https://api.geoapify.com/v1/geocode/reverse?lat=${this.lat}&lon=${this.long}&apiKey=b40d04c271104006843d3c8dc5c8fd1b`,
      // );
      // console.log(data);
    }
  },
  methods: {
    backToMain() {
      this.$router.push({
        name: 'Login_Register',
      });
    },
    setFocus() {
      console.log('click');
      console.log(this.center);
      this.center = { lat: this.currentPos.lat, lng: this.currentPos.lng };
      console.log(this.center);
    },
    setFocus2() {
      console.log('click');
      console.log(this.center);
      this.center = { lat: 16.0, lng: 0.1234 };
      console.log(this.center);
    },
  },
};
</script>
