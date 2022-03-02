<template>
  <v-container>
    <v-container class="mb-5">
      <h2 class="text-center">Track Position</h2>
    </v-container>

    <!--Map-->
    <div id="map" style="height: 400px"></div>

    <br />
    <br />

    <v-container>
      <v-row class="justify-center">
        <!--Start/Stop-Button-->
        <v-btn class="light-blue accent-3" @click="startStopTracker">{{ text }}</v-btn>
        <!--Alarm-Button-->
        <v-row class="justify-center" v-if="started">
          <v-btn class="red" @click="sendAlarm">Alarm</v-btn>
        </v-row>
      </v-row>
    </v-container>

    <!-- Coordinaten Testanzeige -->
    <ul v-for="(pos, i) in loc" :key="i">
      <li>ABC: latitude: {{ pos.lat }} longitude: {{ pos.lng }} time: {{ pos.dateTime }}</li>
    </ul>
  </v-container>
</template>

<script>
import axios from 'axios';
import mapbox from 'mapbox-gl';
import findPolizeistation from '../PolizeistationFinden';

export default {
  name: 'userMap',

  data() {
    return {
      centerPosition: undefined,
      loc: [],

      text: 'Start Tracker',
      started: false,
      interval: '',

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',

      //Map
      map: null,
      mapAccessToken:
        'pk.eyJ1IjoiY29taW5naG9tZXNhZmUiLCJhIjoiY2wwN3RzZThnMDF3czNjbzFndnNrZ3h4OCJ9.xuaKaO_7XzSqiIBCAvcT7w',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      mapMarkerListe: [],

      apiKey: process.env.VUE_APP_GEOCODING,
    };
  },

  mounted() {
    //Richtet jetzige Position und Map ein
    this.setLocationLatLngAndMap();

    //Websockets schauen ob sie am Localhost oder auf Heroku verwendet werden
    if (process.env.VUE_APP_WebSocketOfflineMode) {
      this.ws = new WebSocket(this.ws_serverAdress);
    } else {
      let HOST = location.origin.replace(/^https/, 'wss');
      this.ws = new WebSocket(HOST);
    }
  },

  methods: {
    sendAlarm() {
      const closest = findPolizeistation(this.centerPosition.lat, this.centerPosition.lng);
      console.log(closest);
      const obj = {
        type: 'Alarm',
        user: this.$store.state.aktiverUser,
      };
      this.ws.send(JSON.stringify(obj));
    },

    deleteAllMarkers() {
      this.mapMarkerListe.forEach((element) => {
        element.remove();
      });
    },

    //Beim Start Dinge initialisieren
    async setLocationLatLngAndMap() {
      //Aktuellen Standort bekommen
      let getCoordinates = () =>
        new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      let {
        coords: { latitude: lat, longitude: lng },
      } = await getCoordinates();

      //Sich selber auf die centerposition setzen
      this.centerPosition = { lat, lng };

      //Map-Initialisieren
      mapbox.accessToken = this.mapAccessToken;
      this.map = new mapbox.Map({
        container: 'map', // container ID
        style: this.mapStyle, // style URL
        center: [this.centerPosition.lng, this.centerPosition.lat],
        zoom: 6, // starting zoom
      });
    },

    //Button-Event für Tracker
    startStopTracker() {
      if (!this.started) {
        this.started = true;
        this.text = 'Stop Tracker';
        this.interval = setInterval(this.track, 2500);
      } else {
        this.started = false;
        this.text = 'Start Tracker';
        //Marker löschen
        this.deleteAllMarkers();
        clearInterval(this.interval);
      }
    },

    async track() {
      if (navigator.geolocation) {
        //Aktueller Standort wird abgefragt
        let getCoordinates = () =>
          new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

        let {
          coords: { latitude: lat, longitude: lng },
        } = await getCoordinates();

        let standortDaten = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapbox.accessToken}`,
        );
        const standort = standortDaten.data.features[0].place_name;
        console.log(standort);

        //Marker auf sich selbst setzen und alten davor löschen
        this.deleteAllMarkers();

        //Neuen (einzigen) Marker generieren
        const marker1 = new mapbox.Marker({
          anchor: 'center',
          color: '#03C04A',
        })
          .setLngLat([lng, lat])
          .addTo(this.map)
          .setPopup(new mapbox.Popup().setHTML(`<p>Deine Position: ${standort} </p>`)); // add popup
        this.mapMarkerListe.push(marker1);

        //Center-Position neu setzen und Map zentrieren
        this.centerPosition = {
          lat,
          lng,
        };
        this.map.center = [this.centerPosition.lng, this.centerPosition.lat];

        //Datum
        const date = new Date();

        //Object für WS bauen
        let position = {
          lat,
          lng,
          dateTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
          id: 1,
          user: this.$store.state.aktiverUser,
          // adresse: data.features[0].properties.formatted,
        };

        this.ws.send(JSON.stringify(position));
      } else {
        alert('Dieser Browser unterstützt die Abfrage der Geolocation nicht.');
      }
    },
  },
};
</script>
