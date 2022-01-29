<template>
	<v-container>
		<h2 class="text-center">Login</h2>
		<p @click="changePage">
			get Back to
			<span @click="changePage" class="text-decoration-underline pointer">Register</span>
		</p>
	</v-container>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {};
	},
	methods: {
		changePage() {
			try {
				localStorage.removeItem('firstTime');
				localStorage.setItem('firstTime', true);

        location.reload()
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>

<style>
.pointer:hover {
	cursor: pointer;
}
</style>
