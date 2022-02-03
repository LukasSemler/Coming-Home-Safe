<template>
  <v-container>
    <h2 class="text-center">Login</h2>

    <v-container class="grey lighten-2 rounded-lg mt-3">
      <v-form ref="form" v-model="validLogin" lazy-validation>
        <v-container>
          <v-row class="justify-center">
            <v-col md="8">
              <!--Email-->
              <v-row class="justify-center">
                <v-col md="8">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    clearable
                    required
                    :rules="rules.EmailRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!--Passwort-->
              <v-row class="justify-center">
                <v-col md="8">
                  <v-text-field
                    v-model="passwort"
                    :append-icon="showPasswordInput ? 'xsi-eye' : 'xsi-eye-off'"
                    :rules="rules.required"
                    :type="showPasswordInput ? 'text' : 'password'"
                    label="Passwort"
                    required
                    @click:append="showPasswordInput = !showPasswordInput"
                    :tabindex="-1"
                  ></v-text-field>
                  <p
                    class="light-blue--text text--accent-3 text-decoration-underline mt-3 pointer"
                    @click="showPWvergessen"
                  >
                    Passwort vergessen
                  </p>
                </v-col>
              </v-row>
              <!--Submit-->
              <v-row class="justify-center">
                <v-btn @click="submit">Einloggen</v-btn>
              </v-row>

              <!--Register weiterleiten-->
              <br />
              <br />
              <v-row class="justify-center">
                <v-col md="8">
                  <p>
                    get Back to
                    <span @click="changePage" class="text-decoration-underline pointer"
                      >Register</span
                    >
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      email: '',
      passwort: '',
      showPasswordInput: false,
      showPasswortVergessen: false,
      validLogin: true,

      rules: {
        required: [(val) => (val || '').length > 0 || 'This field is required'],
        EmailRules: [
          (value) => !!value || 'This field is required.',
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
        ],
      },
    };
  },
  methods: {
    changePage() {
      localStorage.removeItem('everLoggedIn');
      location.reload();
    },
    showPWvergessen() {},
    async submit() {
      let { status, data } = await axios.post('http://localhost:2410/login', {
        email: this.email,
        passwort: this.passwort,
      });

      //User der sich einloggen will
      let einlogUser = data;
      console.log(einlogUser);

      //Auf ergebnis handeln
      if (status == 200) {
        //Ever Logged-in in LS speichern
        localStorage.setItem('everLoggedIn', true);

        //Aktiven Kunden im Store speichern
        this.$store.state.aktiverUser = data;
        localStorage.setItem(`login`, JSON.stringify(this.$store.state.aktiverUser));

        //Zur Map weiterleiten
        this.$router.push('/map');
      } else if (status == 200 && data.isadmin == true) {
        //Zur Adminmap weiterleiten
        this.$router.push('/AdminMap');
      } else {
        alert('Deine Daten sind leider Falsch');
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
