<template>
  <v-container>
    <h2 class="text-center">Register</h2>
    <br />

    <!-- <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" @click="register"> Register </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">2 Faktor Authentication</span>
          </v-card-title>
          <v-card-text>
            <v-otp-input length="6" class="my-3" @finish="submit"></v-otp-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" @click="close"> Cancle </v-btn>
            <v-btn color="green darken-1" @click="submit = false"> Submit </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row> -->

    <v-container class="grey lighten-2 rounded-lg">
      <v-form ref="form_Register" v-model="valid" lazy-validation>
        <v-container class="d-flex flex-wrap justify-center">
          <!--Vor-Nachname- Inputs-->
          <v-col>
            <!--MeinSpalte wo Inputs liegen-->
            <v-row class="justify-center">
              <v-col md="4">
                <v-text-field
                  type="text"
                  label="Vorname"
                  v-model="Vorname"
                  :rules="rules.required"
                  clearable
                  required
                />
              </v-col>

              <v-col md="4">
                <v-text-field
                  label="Nachname"
                  v-model="Nachname"
                  :rules="rules.required"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Email Input-->
            <v-row class="justify-center">
              <v-col md="8">
                <v-text-field
                  label="E-Mail"
                  type="mail"
                  v-model="Email"
                  :rules="rules.EmailRules"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Passwort-->
            <v-row class="justify-center">
              <v-col md="4">
                <v-text-field
                  :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label="Passwort"
                  v-model="Passwort1"
                  @click:append="showPasswordInput = !showPasswordInput"
                  required
                  clearable
                />
              </v-col>

              <v-col md="4"
                ><v-text-field
                  :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label="Passwort"
                  v-model="Passwort2"
                  @click:append="showPasswordInput = !showPasswordInput"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Adresse-->
            <v-row class="justify-center">
              <v-col md="3">
                <v-text-field
                  label="Straße + Hausnr"
                  v-model="Strasse"
                  :rules="rules.required"
                  required
                  clearable
                />
              </v-col>
              <v-col md="2">
                <v-text-field
                  label="PLZ"
                  v-model="Plz"
                  :rules="rules.PlzRules"
                  required
                  clearable
                />
              </v-col>
              <v-col md="3">
                <v-text-field
                  label="Ort"
                  v-model="Ort"
                  :rules="rules.required"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col md="8">
                <v-textarea
                  v-model="interessen"
                  solo
                  name="interessen"
                  label="Geben Sie persönliche Interessen oder Hobbys an"
                  background-color="grey lighten-2"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col md="8">
                <v-checkbox
                  v-model="datenschutz"
                  label="Akzeptieren Sie unsere Datenschutzbestimmungen"
                  :rules="validateCheckbox"
                >
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col md="8">
                <p>
                  Sind Sie schon Registriert?
                  <span @click="changePage" class="text-decoration-underline pointer">Login</span>
                </p>
              </v-col>
            </v-row>
            <!--Submit-Bttn-->
            <!-- <v-row class="justify-center" style="margin-top: 2rem">
              <v-btn @click="register" class="light-blue accent-3"> Register </v-btn>
            </v-row> -->
            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on" @click="openOTP">
                    Register
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">2 Faktor Authentication</span>
                  </v-card-title>
                  <v-card-text>
                    <v-otp-input length="6" class="my-3" @finish="submit"></v-otp-input>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" @click="close"> Cancle </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-col>
        </v-container>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,

      //Inputvariablen
      Vorname: '',
      Nachname: '',
      Email: '',
      Passwort1: '',
      Passwort2: '',
      Strasse: '',
      Plz: '',
      Ort: '',
      interessen: '',
      datenschutz: [],
      dialog: false,
      otp_input: '',

      //Variablen
      valid: true,
      showPasswordInput: false,
      showAuthenticator: false,
      showAuthError: false,
      showEmailInUse: false,

      //Anorderungen an die Inputs
      rules: {
        required: [(value) => !!value || 'Required.'],
        required: [(val) => (val || '').length > 0 || 'This field is required'],
        EmailRules: [
          (value) => !!value || 'Required.',
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
        ],
        PlzRules: [
          (value) => !!value || 'Required.',
          (value) => {
            const pattern = /^\d{4,5}$/;
            return pattern.test(value);
          },
        ],
      },
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.clearFelder();
    },
    async submit() {
      if (this.$refs.form_Register.validate()) {
        if (this.Passwort1 == this.Passwort2) {
          console.log("Submit");

          const kunde = {
            vorname: this.Vorname,
            nachname: this.Nachname,
            email: this.Email,
            passwort: this.Passwort1,
            Strasse: this.Strasse,
            PLZ: this.Plz,
            Ort: this.Ort,
            interessen: this.interessen,
          };

          // const res = await axios.post(`${this.serverAdress}/registerGetAuth`, kunde);

          // console.log(res);

          this.clearFelder();
          this.dialog = false;
          this.$router.push({name: 'Map'})
        }
      }
    },
    openOTP() {
      this.dialog = true;
     
    },
    clearFelder() {
      this.Vorname = null;
      this.Nachname = null;
      this.Email = null;
      this.Passwort1 = null;
      this.Passwort2 = null;
      this.Strasse = null;
      this.Plz = null;
      this.Ort = null;
      this.interessen = null;
    },
    changePage() {
      try {
        localStorage.removeItem('firstTime');
        localStorage.setItem('firstTime', false);

        location.reload();
      } catch (err) {
        console.log('set');
        localStorage.setItem('firstTime', false);

        location.reload();
      }
    },
  },
  computed: {
    validateCheckbox() {
      return [this.datenschutz.length > 0 || 'Required'];
    },
  },
};
</script>

<style>
.pointer:hover {
  cursor: pointer;
}
</style>
