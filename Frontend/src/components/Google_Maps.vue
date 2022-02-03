<template>
  <v-container>
    <v-container>
      <h2 class="text-center">Track Position</h2>
      <!-- <GmapAutocomplete @place_changed="setPlace" />
      <button @click="addMarker">Add</button> -->
    </v-container>
    <br />
    <GmapMap :center="center" :zoom="12" style="width: 100%; height: 800px">
      <GmapMarker :key="index" v-for="(m, index) in locations" :position="m" />
    </GmapMap>

    <br />
    <br />

    <v-container>
      <v-row class="justify-center">
        <v-btn class="light-blue accent-3" @click="startTracker">{{ text }}</v-btn>
      </v-row>
    </v-container>
    <ul v-for="(pos, i) in loc" :key="i">
      <li>latitude: {{ pos.lat }} longitude: {{ pos.lng }} time: {{ pos.dateTime }}</li>
    </ul>
  </v-container>
</template>

<script>
export default {
  name: 'GoogleMap',
  data() {
    return {
      center: {},
      currentPlace: null,
      markers: [],
      locations: [],
      loc: [],

      text: 'Start Tracker',
      started: false,
      interval: '',

      ws: null,
      ws_serverAdress: 'ws://localhost:2410',
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
    this.ws = new WebSocket(this.ws_serverAdress);
    this.ws.onmessage = ({ data }) => {
      console.log(data);
      try {
        let bekommen = JSON.parse(data);
        console.log(bekommen);
      } catch (error) {
        console.log(error);
      }
    };
  },
  methods: {
    backToMain() {
      this.$router.push({ name: 'Login_Register' });
    }, //
    setLocationLatLng() {
      navigator.geolocation.getCurrentPosition((geolocation) => {
        let currPos = {
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude,
        };

        this.$store.state.currentPosition = currPos;
        console.log(`Current position Google Maps = ${currPos}`);
        this.center = currPos;

        this.locations = [
          {
            lat: geolocation.coords.latitude,
            lng: geolocation.coords.longitude,
            lable: 'Current Position',
          },
        ];
      });
    },

    startTracker() {
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
      // console.log(this.locations);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          lat = Number(pos.coords.latitude);
          lng = Number(pos.coords.longitude);

          //Object fuer DB bauen
          position = {
            lat,
            lng,
            dateTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            id: 1,
            user: this.$store.state.aktiverUserTest,
          };

          this.ws.send(JSON.stringify(position));

          this.loc.push(position); //Marker auf aktuelle position setzten
          this.locations = [
            {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              lable: 'Current Position',
            },
          ];

          //Axios Call Post
          // const res = await axios.post(`${this.serverAdress}/location`, { position });
        });
      } else {
        alert('Dieser Browser unterstützt die Abfrage der Geolocation nicht.');
      }
    },
  },
};
</script>
