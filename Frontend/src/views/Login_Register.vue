<template>
  <v-container>
    <h1 class="text-center">Willkommen bei Coming Home Safe</h1>
    <!-- <v-btn @click="toMap">Zu der Karte</v-btn> -->
    <br />

    <!--Login-->
    <v-container v-if="everLoggedIn">
      <Login />
    </v-container>

    <!--Register-->
    <v-container v-else>
      <Register />
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
      everLoggedIn: false,
    };
  },
  components: {
    Login,
    Register,
  },
  created() {
    //Schaut im LS ob User schon mal eingeloggt war, für Seiten-Weiterleitung
    // try {
    //   const l = localStorage.getItem('everLoggedIn');
    //   if (l) {
    //     this.everLoggedIn = true;
    //   } else {
    //     this.everLoggedIn = false;
    //   }
    // } catch {
    //   this.everLoggedIn = false;
    // }

    let alreadyLogin = JSON.parse(localStorage.getItem('login'));
    if (alreadyLogin) {
      this.$store.state.aktiverUser = alreadyLogin;
      this.$router.push('Map');
    } else {
      try {
        const l = localStorage.getItem('everLoggedIn');
        if (l) {
          this.everLoggedIn = true;
        } else {
          this.everLoggedIn = false;
        }
      } catch {
        this.everLoggedIn = false;
      }
    }
  },
  computed: {
    checkStatus() {},
  },
  methods: {
    toMap() {
      this.$router.push({ name: 'Map' });
    },
  },
};
</script>
