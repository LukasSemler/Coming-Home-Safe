<template>
  <v-container>
    <v-row class="justify-center">
      <v-col md="6">
        <v-btn class="light-blue accent-3" @click="startTracker">{{ text }}</v-btn>
      </v-col>
    </v-row>
    <ul v-for="(pos, i) in locations" :key="i">
      <li>latitude: {{ pos.lat }} longitude: {{ pos.lng }} time: {{ pos.dateTime }}</li>
    </ul>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Tracker',
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      text: 'Start Tracker',
      started: false,
      interval: '',
      locations: [],
    };
  },
  methods: {
    startTracker() {
      if (!this.started) {
        this.started = true;
        this.text = 'Stop Tracker';
        this.interval = setInterval(this.track, 2000);
      } else {
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
        navigator.geolocation.getCurrentPosition(async (position) => {
          lat = position.coords.latitude;
          lng = position.coords.longitude;

          position = {
            lat,
            lng,
            dateTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
          };

          this.locations.push(position);
          console.log(this.locations);

          //Axios Call Post
          // const res = await axios.post(`${this.serverAdress}/location`, { position });

          //Aktuelle Position im Store setzen
          this.$store.state.currentPosition = position;
        });
      } else {
        alert('Dieser Browser unterstützt die Abfrage der Geolocation nicht.');
      }
    },
  },
  mounted() {
    console.log('mounted Tracker');
    console.log(`CurrPos state Mounted ${this.$store.state.currPos}`);
    // this.track();
  },
};
</script>

<style></style>
