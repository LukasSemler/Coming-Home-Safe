<template>
  <v-container>
    <h1 class="text-center">Admin Map View</h1>
    <br />
    <v-row>
      <v-col class="text-right">
        <v-btn outlined text class="red accent-3 justify-right" @click="abmelden"> Abmelden </v-btn>
      </v-col>
      <v-col v-if="this.$store.state.aktiverUser.superUser" class="text-right">
        <v-btn outlined text class="red accent-3 justify-right" @click="changeAdminPanel">
          Zum Admin Panel
        </v-btn>
      </v-col>
      <div v-else>
        <h1>Else</h1>
      </div>
    </v-row>
    <br />
    <adminMap />
  </v-container>
</template>

<script>
import adminMap from '../components/adminMap.vue';
import axios from 'axios';
export default {
	name: 'Admin-Map',
	components: { adminMap },
	data() {
		return { 
      
     };
	},
	methods: {
		async abmelden() {
			await axios.get(`/abmelden`);
			this.$router.push('/');

			localStorage.removeItem(`login`);

			//Kunden aus Store löschen
			this.$store.dispatch('LogoutKunde');
		},
		changeAdminPanel() {
			this.$router.push("/adminPanel")
		},
	},
};
</script>

<style></style>
