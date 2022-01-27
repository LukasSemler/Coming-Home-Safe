<template>
<v-container>
  <h2 class="text-center">Login</h2>
  <p @click="changePage">get Back to Register</p>
</v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {};
  },
  methods: {
    changePage(){
      localStorage.removeItem('firstTime')
      localStorage.setItem('firstTime', true);
    }
  }
};
</script>

<style></style>
