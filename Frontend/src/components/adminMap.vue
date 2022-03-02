<template>
  <v-container>
    <v-container>
      <h2 class="text-center">Watch Position Test</h2>
    </v-container>
    <br />

    <!--Map-->
    <div id="map" style="height: 400px"></div>

    <br />
    <h1 class="text-center" v-if="locationSingleUser.length == 0">
      Es sind noch keine User vorhanden
    </h1>

    <v-container v-if="locationSingleUser.length != 0">
      <v-card class="mx-auto" max-width="500" elevation="2" :color="color">
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
          <v-btn class="light-blue" outlined text @click="setFocusToUser"> Show on Map </v-btn>
          <v-btn v-if="alarm" class="light-blue" outlined text @click="clearUserAlarm">
            Dismiss Alarm
          </v-btn>
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
import mapbox from 'mapbox-gl';

export default {
  name: 'GoogleMap',
  data() {
    return {
      center: {
        lat: 48.2094881,
        lng: 16.3072147,
      },

      text: 'Start Tracker',

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',
      locationSingleUser: [],
      users: {},
      currentPos: null,

      lat: null,
      long: null,

      //Alarm
      alarm: false,
      color: 'white',
      interval: null,

      //Map
      map: null,
      mapAccessToken:
        'pk.eyJ1IjoiY29taW5naG9tZXNhZmUiLCJhIjoiY2wwN3RzZThnMDF3czNjbzFndnNrZ3h4OCJ9.xuaKaO_7XzSqiIBCAvcT7w',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      mapMarkerListe: [],
    };
  },

  async created() {
    //Websockets schauen ob sie am Localhost oder auf Heroku verwendet werden
    if (process.env.VUE_APP_WebSocketOfflineMode) {
      this.ws = new WebSocket(this.ws_serverAdress);
    } else {
      let HOST = location.origin.replace(/^https/, 'wss');
      this.ws = new WebSocket(HOST);
    }

    //Wenn Nachrichten von Websocket kommen
    this.ws.onmessage = ({ data }) => {
      let bekommen = JSON.parse(data);
      console.log(bekommen)
      console.log(bekommen);
      this.currentPos = bekommen;

      //Messages von WS zu Admin
      if (bekommen.type == 'info') {
        this.locationSingleUser = [];
      } else if (bekommen.type == 'Alarm') {
        this.alarm = true;
        this.interval = setInterval(() => {
          if (this.color == 'white') this.color = 'red';
          else this.color = 'white';
        }, 500);
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
      }
    };
  },

  async mounted() {
    //Map-Initialisieren
    //Aktuellen Standort holen
    let getCoordinates = () =>
      new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

    let {
      coords: { latitude: lat, longitude: lng },
    } = await getCoordinates();

    //Map initiallisieren
    mapbox.accessToken = this.mapAccessToken;
    this.map = new mapbox.Map({
      container: 'map', // container ID
      style: this.mapStyle, // style URL
      center: [lng, lat],
      zoom: 6, // starting zoom
    });
  },

  methods: {
    clearUserAlarm() {
      this.alarm = false;
      clearInterval(this.interval);
      this.color = 'white';
    },

    setFocusToUser() {
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
