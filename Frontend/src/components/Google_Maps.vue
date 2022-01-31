<template>
  <div>
    <div>
      <h2 class="text-center">Track Position</h2>
      <!-- <GmapAutocomplete @place_changed="setPlace" />
      <button @click="addMarker">Add</button> -->
    </div>
    <br />
    <GmapMap :center="center" :zoom="12" style="width: 100%; height: 800px">
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center = m.position"
      />
    </GmapMap>
    {{markers}}
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  data() {
    return {
      center: { lat: 48.208176, lng: 16.373819 },
      currentPlace: null,
      markers: [],
      places: [],
    };
  },
  mounted() {
    this.geolocate();
  },
  methods: {
    // addMarker() {
    //   if (this.currentPlace) {
    //     const marker = {
    //       lat: this.currentPlace.geometry.location.lat(),
    //       lng: this.currentPlace.geometry.location.lng(),
    //     };
    //     this.markers.push({ position: marker });
    //     this.places.push(this.currentPlace);
    //     this.center = marker;
    //     this.currentPlace = null;
    //   }
    // },
    geolocate() {
      if (this.$store.state.position) {
        this.center = {
          lat: this.$state.store.position.latitude,
          lng: this.$state.store.position.longitude,
        };

        const position = this.$store.state.position.map((elem) => ({
          lat: elem.lat,
          lng: elem.lng,
        }));
        this.markers.push({ position: position });
        console.log(this.markers);
      }
    },
  },
};
</script>
