<template>
  <v-container>
    <v-container>
      <h2 class="text-center">Watch Position Test</h2>
    </v-container>
    <br />

    <!--Map-->
    <div id="map" style="height: 600px"></div>

    <!--User die getracked werden-->
    <br />
    <h1 class="text-center" v-if="locationSingleUser.length == 0">
      Es sind noch keine User vorhanden
    </h1>

    <v-container v-if="locationSingleUser.length != 0">
      <v-card
        class="mx-auto"
        max-width="500"
        elevation="2"
        :color="color"
        v-for="(user, i) of multiUser"
        :key="i"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 mb-1"
              >{{ user.user.vorname }} {{ user.user.nachname }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <b>Persoenliche Infos:</b>
              {{ user.user.hobbysinteressen }}</v-list-item-subtitle
            >
            <v-list-item-subtitle>
              <b>Aktuelle Adresse: </b> {{ user.adresse }}</v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn class="chs-button" outlined text @click="setFocusToUser(user)">
            Show on Map
          </v-btn>
          <v-btn v-if="alarm" class="chs-button" outlined text @click="clearUserAlarm">
            Dismiss Alarm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <br />
    <br />
  </v-container>
</template>

<script>
import mapbox from 'mapbox-gl';

export default {
  name: 'GoogleMap',
  data() {
    return {
      text: 'Start Tracker',

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',
      // ws_serverAdress: 'wss://coming-home-safe.herokuapp.com',
      locationSingleUser: [],
      users: {},

      aktiverUser: this.$store.state.aktiverUser,

      //? Neu
      multiUser: [],
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
    //TODO DAS WIRD DANN ÜBERARBEITET
    //Websockets schauen ob sie am Localhost oder auf Heroku verwendet werden
    if (process.env.VUE_APP_WebSocketOfflineMode) {
      this.ws = new WebSocket(this.ws_serverAdress);
    } else {
      let HOST = location.origin.replace(/^https/, 'wss');
      this.ws = new WebSocket(HOST);
    }

    //Wenn Nachrichten von Websocket kommen
    this.ws.onmessage = ({ data: WebSocketMessageData }) => {
      const { data, type } = JSON.parse(WebSocketMessageData);

      this.currentPos = data;

      //Messages von WS zu Admin
      if (type == 'userLeft') {
        //Marker entfernen
        this.mapMarkerListe.forEach((elem) => {
          //? Marker vom user finden
          if (elem.user.email == data) {
            //? Index vom Obj mit user und marker finden
            const userIndex = this.mapMarkerListe.findIndex((x) => x.user.email == data);
            //? marker aus Arry und Karte entfernen
            this.mapMarkerListe.splice(userIndex, 1);
            elem.marker.remove();
          }
        });

        // User aus dem Array löschen
        this.multiUser = this.multiUser.filter((elem) => elem.user.email != data);
        this.mapMarkerListe = this.mapMarkerListe.filter((elem) => elem.user.email != data);
      } else if (type == 'alarm') {
        this.alarm = true;
        this.interval = setInterval(() => {
          if (this.color == 'white') this.color = 'red';
          else this.color = 'white';
        }, 500);
      } else if (type == 'newConnection') {
        console.log('Neuer User');
      } else {
        //? Schauen ob der User schon vorhanden ist
        let gefunden = this.multiUser.find((element) => element.user.email == data.user.email);
        //? Wenn noch nicht vorhanden pushen
        if (!gefunden) {
          //? Neuen User ins Array Pushen
          this.multiUser.push({
            user: data.user,
            adresse: data.adresse,
            lat: data.lat,
            lng: data.lng,
            markerFarbe: this.markerFarbe(),
          });
          //? Neuen Marker erstellen
          const marker = new mapbox.Marker({
            anchor: 'center',
            color: this.markerFarbe(),
          })
            .setLngLat([data.lng, data.lat])
            .addTo(this.map)
            .setPopup(new mapbox.Popup().setHTML(`<p>Deine Position: ${data.adresse} </p>`));
          this.mapMarkerListe.push({ marker, user: data.user });
        } else {
          this.multiUser.forEach((elem) => {
            //? Schauen ob sich die Adresse gändert hat
            if (elem.lat != data.lat || elem.lng != data.lng) {
              //? Wenn sich die Werte geandert haben sie neu zuweisen
              gefunden.adresse = data.adresse;
              gefunden.lat = data.lat;
              gefunden.lng = data.lng;
              //? Alten Marker vom user löschen
              this.mapMarkerListe.forEach((elem) => {
                //? Marker vom user finden
                if (elem.user.email == gefunden.user.email) {
                  //? Index vom Obj mit user und marker finden
                  const userIndex = this.mapMarkerListe.findIndex(
                    (x) => x.user.email == data.user.email,
                  );
                  //? marker aus Arry und Karte entfernen
                  this.mapMarkerListe.splice(userIndex, 1);
                  elem.marker.remove();
                  // //? Neuen marker erstellen
                  const marker = new mapbox.Marker({
                    anchor: 'center',
                    color: elem.markerFarbe,
                  })
                    .setLngLat([gefunden.lng, gefunden.lat])
                    .addTo(this.map)
                    .setPopup(
                      new mapbox.Popup().setHTML(`<p>Deine Position: ${gefunden.adresse} </p>`),
                    ); // add popup
                  //? Neuen Marker mit User im Array speichern
                  this.mapMarkerListe.push({ marker, user: gefunden.user });
                }
              });
            }
          });
        }
        this.locationSingleUser = [
          {
            lat: data.lat,
            lng: data.lng,
            lable: 'Current Position User 1',
          },
        ];
        this.lat = data.lat;
        this.long = data.lng;
      }
    };
  },

  async mounted() {
    console.log('In der AdminMap');

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
    //Mit WS Verbindung herstellen
    connectToWs() {
      let email = this.aktiverUser.email;
      email = email.replace('@', '|');
      if (process.env.VUE_APP_WebSocketOfflineMode) {
        this.ws = new WebSocket(this.ws_serverAdress, email);
      } else {
        let HOST = location.origin.replace(/^https/, 'wss');
        this.ws = new WebSocket(HOST, email);
      }

      //Reconnect wenn die Verbindung geschlossen wird
      this.ws.addEventListener('close', (event) => {
        this.ws.close();
        this.ws = null;
        this.connectToWs();
      });

      this.ws.addEventListener('message', (event) => {
        console.log(event);
      });
    },

    markerFarbe() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    clearUserAlarm() {
      this.alarm = false;
      clearInterval(this.interval);
      this.color = 'white';
    },

    setFocusToUser({ lat: aktuellLat, lng: aktuellLng }) {
      //Centriert die Map an einem User, und zoomt auch näher hin
      this.map.flyTo({
        center: [aktuellLng, aktuellLat],
        zoom: 16,
      });
    },
  },
};
</script>

<style scoped>
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
