<template>
	<v-container>
		<h1 class="text-center">Willkommen bei Coming Home Safe</h1>
		<br />
		<v-container v-if="firstTime">
			<Register />
		</v-container>

		<v-container v-else>
			<Login />
		</v-container>
	</v-container>
</template>

<script>
import Login from '../components/Login';
import Register from '../components/Register';

export default {
	name: 'Login_Register',
	data() {
		return {
			firstTime: true,
		};
	},
	components: {
		Login,
		Register,
	},
	created() {
		let getItem = localStorage.getItem('firstTime');
		if (getItem != null) {
			if (getItem == 'false') this.firstTime = false;
			else this.firstTime = true;
		} else console.log('Null');
	},
	computed: {
		checkStatus() {},
	},
};
</script>
