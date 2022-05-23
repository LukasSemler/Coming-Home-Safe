<template>
  <v-container>
    <v-container class="mb-5">
      <h2 class="text-center">Track Position</h2>
    </v-container>

    <!--Map-->
    <div id="map" style="height: 600px"></div>

    <br />
    <br />
    <v-row class="justify-center">
      <v-col cols="3">
        <v-card v-if="alarmStarted" elevation="5" max-width="374">
          <v-card-title class="text-h5 mb-3">Dauer: {{ dauerRoute }}min </v-card-title>

          <v-card-subtitle v-for="(step, i) of routenAnweisungen" :key="i">
            {{ step }}
            <!-- <span v-if="step.includes('Turn left')">
              <v-icon large>mdi-arrow-left-top-bold</v-icon>{{ step }}
            </span>
            <span v-if="step.includes('Turn right')">
              <v-icon large>mdi-arrow-right-top-bold</v-icon>{{ step }}
            </span>
            <span v-else> <v-icon large>mdi-arrow-right-top-bold</v-icon>{{ step }} </span> -->
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <br />
    <br />

    <v-container>
      <v-row class="justify-center">
        <!--Start/Stop-Button-->
        <v-btn class="chs-button" @click="startStopTracker">{{ text }}</v-btn>
        <!--Alarm-Button-->
        <v-row class="justify-center" v-if="started">
          <v-btn class="chs-button-red" @click="sendAlarm">Alarm</v-btn>
        </v-row>
      </v-row>
    </v-container>

    <!-- Coordinaten Testanzeige -->
    <!-- <ul v-for="(pos, i) in loc" :key="i">
      <li>ABC: latitude: {{ pos.lat }} longitude: {{ pos.lng }} time: {{ pos.dateTime }}</li>
    </ul> -->
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
      trackIntervall: null,

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',

      //Map
      map: null,
      mapAccessToken:
        'pk.eyJ1IjoiY29taW5naG9tZXNhZmUiLCJhIjoiY2wwN3RzZThnMDF3czNjbzFndnNrZ3h4OCJ9.xuaKaO_7XzSqiIBCAvcT7w',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      mapMarkerListe: [],

      closestPol: null,

      alarmStarted: false,
      routenAnweisungen: [],
      dauerRoute: null,

      aktiverUser: this.$store.state.aktiverUser,
    };
  },

  props: {
    logoutClickedStatus: false,
  },

  watch: {
    logoutClickedStatus(newVar, oldVar) {
      //Wenn Sich User ausloggt und der Tracker an ist, vom Websocket trennen
      if (newVar && this.started) {
        this.startStopTracker();
      }

      //WebsocketVerbindung löschen
      this.disconnectFromWs();
    },
  },

  mounted() {
    //Richtet jetzige Position und Map ein
    this.centerMap();

    //ServiceWorker mit WS verbinden lassen
    this.connectToWs();

    //Reload unterbinden
    window.addEventListener('beforeunload', (event) => {
      //Von Websocket Verbindung trennen
      this.disconnectFromWs();
    });
  },

  methods: {
    //Mit WS Verbindung herstellen
    connectToWs() {
      //Je nach Offline oder Onlinemode entscheiden und WebsocketPfad umbauen

      //WebsocketAdresse auf WSS ändern wenn HTTPS
      if (window.location.protocol == 'https') {
        this.ws_serverAdress == `wss://localhost:${process.env.PORT}`;
      }

      //ServiceWorker sagen, dass er sich verbinden soll
      navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage(
          JSON.stringify({
            type: 'connect',
            payload: { wsAdresse: this.ws_serverAdress, email: this.aktiverUser.email },
          }),
        );
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, payload } = JSON.parse(event.data);

        console.log(`Type: ${type} Payload: ${payload}`);
      });
    },

    //Mit WS Verbindung trennen
    disconnectFromWs() {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage(
          JSON.stringify({
            type: 'disconnect',
            payload: 'disconnectPayload',
          }),
        );
      });
    },

    //Näheste Polizeistation aufsuchen und Route setzen
    sendAlarm() {
      if (this.alarmStarted) return;
      this.alarmStarted = true;
      const start = [this.centerPosition.lng, this.centerPosition.lat];
      //Für Route:
      // const start = [this.centerPosition.lat, this.centerPosition.lng];
      this.closestPol = findPolizeistation(this.centerPosition.lat, this.centerPosition.lng);
      let cx = this.closestPol.station.X;
      let cy = this.closestPol.station.Y;

      console.log(this.closestPol);
      cx = cx.replace(',', '.');
      cy = cy.replace(',', '.');

      cx = Number(cx);
      cy = Number(cy);

      console.log(cx, cy);

      // make an initial directions request that
      // starts and ends at the same location
      this.getRoute(start);

      // Add starting point to the map
      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be',
        },
      });

      const coords = [cx, cy];
      const end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords,
            },
          },
        ],
      };
      if (this.map.getLayer('end')) {
        this.map.getSource('end').setData(end);
      } else {
        this.map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords,
                  },
                },
              ],
            },
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30',
          },
        });
      }
      this.getRoute(coords);

      const obj = {
        type: 'Alarm',
        user: this.$store.state.aktiverUser,
      };

      this.ws.send(JSON.stringify(obj));
    },

    //Löscht alle Marker auf der Map
    deleteAllMarkers() {
      this.mapMarkerListe.forEach((element) => {
        element.remove();
      });
    },

    //Beim Start Dinge initialisieren
    async centerMap() {
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
        zoom: 13, // starting zoom
      });
    },

    //Button-Event für Tracker
    startStopTracker() {
      if (!this.started) {
        //Button anpassen
        this.started = true;
        this.text = 'Stop Tracker';

        //Tracker-Intervall starten
        this.trackIntervall = setInterval(this.track, 1000);

      } else {
        //Marker löschen
        this.deleteAllMarkers();

        //Track-Intervall ausschalten
        clearInterval(this.trackIntervall);
        this.trackIntervall = null;

        //AlarmRoute-löschen
        if (this.alarmStarted) {
          this.map.removeLayer('route');
          this.map.removeSource('route');

          this.map.removeLayer('point');
          this.map.removeSource('point');

          this.map.removeLayer('end');
          this.map.removeSource('end');
        }

        //Button zurücksetzen
        this.started = false;
        this.alarmStarted = false;
        this.text = 'Start Tracker';
      }
    },

    //Route berechnen
    async getRoute(end) {
      const start = [this.centerPosition.lng, this.centerPosition.lat];
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${this.mapAccessToken}`,
        { method: 'GET' },
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };
      // if the route already exists on the map, we'll reset it using setData
      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }
      // Routenanweisung
      const steps = data.legs[0].steps;
      for (const step of steps) {
        this.routenAnweisungen.push(step.maneuver.instruction);
      }
      this.dauerRoute = Math.floor(data.duration / 60);
    },

    //Bekommt standort, setzt Positionsmarker und sendet zum websocket
    async track() {
      if (navigator.geolocation) {
      //Function gibt aktuelle Coordinaten zurück
      let getCoordinates = () =>
        new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      //Aktuelle Standortkoordinaten abfragen
      let {
        coords: { latitude: lat, longitude: lng },
      } = await getCoordinates();

        //Coordinaten werden eingesetzt!
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
          adresse: standort,
        };

        //Standortpaket ServiceWorker schicken, der kümmert sich darum
        navigator.serviceWorker.ready.then((registration) => {
          registration.active.postMessage(
            JSON.stringify({
              type: 'position',
              payload: position,
            }),
          );
        });

      } else {
        alert('Dieser Browser unterstützt die Abfrage der Geolocation nicht.');
      }
    },
  },
};
</script>

<style scoped>
#instructions {
  position: absolute;
  margin: 20px;
  width: 25%;
  top: 0;
  bottom: 20%;
  padding: 20px;
  background-color: #fff;
  overflow-y: scroll;
  font-family: sans-serif;
}
.chs-button {
  background-color: rgba(255, 0, 0, 0) !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14),
    0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
  border: 2px solid #000000;
  border-radius: 20px;
}
.chs-button:hover {
  background-color: rgb(0, 0, 0) !important;
  color: white !important;
  transition: all 0.5s;
}
.chs-button-red {
  background-color: rgba(255, 0, 0, 0) !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14),
    0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
  border: 2px solid #ff0000;
  border-radius: 20px;
  color: red !important;
}
.chs-button-red:hover {
  background-color: red !important;
  color: white !important;
  transition: all 0.5s;
}
</style>
