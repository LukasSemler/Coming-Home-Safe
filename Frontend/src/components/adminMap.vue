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
      // ws_serverAdress: "ws://localhost:2410",
      ws_serverAdress: 'wss://coming-home-safe.herokuapp.com',
      locationSingleUser: [],
      users: {},
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
      console.log('Message bekommen: ', bekommen);
      this.currentPos = bekommen;

      //Messages von WS zu Admin
      if (bekommen.type == 'userLeft') {
        //? user welcher gegangen ist entfernen
        this.multiUser = this.multiUser.filter((elem) => elem.user.email != bekommen.payload);
      } else if (bekommen.type == 'Alarm') {
        this.alarm = true;
        this.interval = setInterval(() => {
          if (this.color == 'white') this.color = 'red';
          else this.color = 'white';
        }, 500);
      } else {
        //? Schauen ob der User schon vorhanden ist
        let gefunden = this.multiUser.find((element) => element.user.email == bekommen.user.email);
        //? Wenn noch nicht vorhanden pushen
        if (!gefunden) {
          //? Neuen User ins Array Pushen
          this.multiUser.push({
            user: bekommen.user,
            adresse: bekommen.adresse,
            lat: bekommen.lat,
            lng: bekommen.lng,
            markerFarbe: this.markerFarbe(),
          });

          //? Neuen Marker erstellen
          const marker = new mapbox.Marker({
            anchor: 'center',
            color: this.markerFarbe(),
          })
            .setLngLat([bekommen.lng, bekommen.lat])
            .addTo(this.map)
            .setPopup(new mapbox.Popup().setHTML(`<p>Deine Position: ${bekommen.adresse} </p>`));

          this.mapMarkerListe.push({ marker, user: bekommen.user });
        } else {
          this.multiUser.forEach((elem) => {
            //? Schauen ob sich die Adresse gändert hat
            if (elem.lat != bekommen.lat || elem.lng != bekommen.lng) {
              //? Wenn sich die Werte geandert haben sie neu zuweisen
              gefunden.adresse = bekommen.adresse;
              gefunden.lat = bekommen.lat;
              gefunden.lng = bekommen.lng;

              //? Alten Marker vom user löschen
              this.mapMarkerListe.forEach((elem) => {
                //? Marker vom user finden
                if (elem.user.email == gefunden.user.email) {
                  //? Index vom Obj mit user und marker finden
                  const userIndex = this.mapMarkerListe.findIndex(
                    (x) => x.user.email == bekommen.user.email,
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
