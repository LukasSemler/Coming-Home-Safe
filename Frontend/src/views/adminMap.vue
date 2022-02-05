<template>
	<v-container>
		<h1 class="text-center">Admin Map View</h1>
		<br />
		<v-row>
			<v-col class="text-right">
				<v-btn outlined text class="red accent-3 justify-right" @click="abmelden"> Abmelden </v-btn>
			</v-col>
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
		return { serverAdress: process.env.VUE_APP_SERVER_ADRESS };
	},
	methods: {
		async abmelden() {
			await axios.get(`${this.serverAdress}/abmelden`);
			this.$router.push('/');

			localStorage.removeItem(`login`);

			//Kunden aus Store löschen
			this.$store.dispatch('LogoutKunde');
		},
	},
};
</script>

<style></style>
