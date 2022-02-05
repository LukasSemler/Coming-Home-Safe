<template>
	<v-container>
		<h1 class="text-center">AdminPanel View</h1>
		<br />
		<adminPanel />
	</v-container>
</template>

<script>
import adminPanel from '../components/adminPanel';
export default {
	name: 'AdminPanel',
	components: { adminPanel },
	data() {
		return {};
	},
};
</script>

<style></style>
