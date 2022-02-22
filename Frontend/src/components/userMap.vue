<template>
  <v-container>
    <v-container>
      <h2 class="text-center">Track Position</h2>
      <!-- <GmapAutocomplete @place_changed="setPlace" />
      <button @click="addMarker">Add</button> -->
    </v-container>
    <br />
    <GmapMap :center="centerPosition" :zoom="12" style="width: 100%; height: 800px">
      <GmapMarker :key="index" v-for="(m, index) in locations" :position="m" />
    </GmapMap>

    <br />
    <br />

    <v-container>
      <v-row class="justify-center">
        <v-btn class="light-blue accent-3" @click="startStopTracker">{{ text }}</v-btn>
      </v-row>
    </v-container>

    <!--Coordinaten Testanzeige-->
    <ul v-for="(pos, i) in loc" :key="i">
      <li>ABC --> latitude: {{ pos.lat }} longitude: {{ pos.lng }} time: {{ pos.dateTime }}</li>
    </ul>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'userMap',
  data() {
    return {
      centerPosition: {},
      locations: [],
      loc: [],

      text: 'Start Tracker',
      started: false,
      interval: '',

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',

      apiKey: process.env.VUE_APP_GEOCODING,
    };
  },
  created() {
    window.addEventListener('beforeunload', (e) => {
      let confirmationMessage =
        ('Wenn Sie die Webseite verlassen, während der Tracker läuft, wird dieser beendet'(
          e || window.event,
        ).returnValue = confirmationMessage); //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
  },
  mounted() {
    this.setLocationLatLng();

    //Websockets schauen ob sie am Localhost oder auf Heroku verwendet werden
    if (process.env.VUE_APP_WebSocketOfflineMode) {
      this.ws = new WebSocket(this.ws_serverAdress);
    } else {
      let HOST = location.origin.replace(/^https/, 'wss');
      this.ws = new WebSocket(HOST);
    }
  },
  methods: {
    backToMain() {
      this.$router.push({ name: 'Login_Register' });
    },

    setLocationLatLng() {
      navigator.geolocation.getCurrentPosition((geolocation) => {
        let currPos = {
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude,
        };

        this.centerPosition = currPos;

        this.locations = [
          {
            lat: geolocation.coords.latitude,
            lng: geolocation.coords.longitude,
            lable: 'Current Position',
          },
        ];
      });
    },

    startStopTracker() {
      if (!this.started) {
        this.started = true;
        this.text = 'Stop Tracker';
        this.interval = setInterval(this.track, 2000);
      } else {
        this.started = false;
        this.text = 'Start Tracker';
        clearInterval(this.interval);
      }
    },

    async track() {
      let lat = '';
      let lng = '';
      let position = '';
      let date = new Date();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          lat = Number(pos.coords.latitude);
          lng = Number(pos.coords.longitude);

          const { data } = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${this.apiKey}`,
          );

          //Object für DB bauen
          position = {
            lat,
            lng,
            dateTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            id: 1,
            user: this.$store.state.aktiverUser,
            adresse: data.features[0].properties.formatted,
          };

          this.ws.send(JSON.stringify(position));

          //Ins Anzeigearray pushen
          this.loc.push(position);

          //Aktuelle Position in der Markerliste
          this.locations = [
            {
              lat: position.lat,
              lng: position.lng,
              lable: 'Current Position',
            },
          ];
        });
      } else {
        alert('Dieser Browser unterstützt die Abfrage der Geolocation nicht.');
      }
    },
  },
};
</script>
