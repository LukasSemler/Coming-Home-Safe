<template>
  <v-container class="chs-register">
    <!-- Error Anzeigen -->
    <v-alert
      v-if="showError"
      shaped
      prominent
      type="error"
      transition="scroll-y-reverse-transition"
    >
      {{ errorText }}
    </v-alert>
    <v-container class="chs-register">
      <h2 class="text-center">Register</h2>
      <p class="mt-4">
        Falls Sie noch kein Konto bei uns haben, können Sie sich hier eines erstellen. Nachdem Sie
        Ihr Konto erstellt haben, können Sie sich einfach anmelden und so unseren Dienst verweden
      </p>
      <!--Eingabe-Form-->
      <v-form ref="form_Register" v-model="valid" lazy-validation>
        <v-container class="d-flex flex-wrap justify-center">
          <!--Vor-Nachname- Inputs-->
          <v-col class="chs-card">
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

            <v-row justify="center">
              <v-col md="8">
                <v-dialog
                  ref="dialog"
                  v-model="geburtsdatumModal"
                  :return-value.sync="geburtsdatum"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="geburtsdatum"
                      label="Geburtsdatum"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="geburtsdatum" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="geburtsdatumModal = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(geburtsdatum)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>

            <!--Interessen-->
            <v-row class="justify-center">
              <v-col md="8">
                <v-textarea
                  v-model="interessen"
                  solo
                  name="interessen"
                  label="Geben Sie persönliche Interessen oder Hobbys an"
                  background-color="grey lighten-4"
                ></v-textarea>
              </v-col>
            </v-row>

            <!--Datenschutz-Checkbox-->
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
                  <span @click="goToLogin" class="text-decoration-underline pointer">Login</span>
                </p>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <!--Register-Button-->
                  <v-btn color="chs-button" v-bind="attrs" @click="openOTP(on)"> Register </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">2 Faktor Authentication</span>
                  </v-card-title>
                  <v-card-text>
                    <v-otp-input length="5" class="my-3" @finish="submitRegistration"></v-otp-input>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" @click="submitRegistration"> Submit </v-btn>
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
      geburtsdatum: null,
      geburtsdatumModal: false,
      datenschutz: [],
      dialog: false,
      gotAuthCode: '',

      errorText: '',
      showError: false,

      //Variablen
      valid: true,
      showPasswordInput: false,
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
      this.datenschutz = [];
      this.geburtsdatum = null;
    },
    close() {
      this.dialog = false;
      this.clearFelder();
    },

    async submitRegistration(passwordOTP_INPUT) {
      if (passwordOTP_INPUT == this.gotAuthCode) {
        try {
          //User in Datenbank eintragen
          await axios.post(`/register`, {
            vorname: this.Vorname,
            nachname: this.Nachname,
            email: this.Email,
            passwort: this.Passwort1,
            strasse: this.Strasse,
            plz: this.Plz,
            ort: this.Ort,
            hobbysinteressen: this.interessen,
            geburtsdatum: this.geburtsdatum,
          });

          //Alle Inputs clearen & OTP-Input-Dialog zumachen
          this.close();

          //Weiterleiten zum Login
          this.goToLogin();
          location.reload();
        } catch (err) {
          console.log(
            'Fehler beim Eintragen des Kunden in die Datenbank (Frontend in submitRegistration)',
          );
          this.close();
        }
      } else {
        alert('Fehler im submitRegistration!');
      }
    },
    //DIALOG MACHT PROBLEME WEIL ER SICH IMMER ÖFFNET !!!!!!!!!
    async openOTP(on) {
      if (this.$refs.form_Register.validate()) {
        if (this.Passwort1 == this.Passwort2) {
          //Überprüfen ob Eingabefelder alle ausgefüllt wurden
          try {
            let { data: code, status } = await axios.post(`/getCode`, {
              email: this.Email,
              name: `${this.Vorname} ${this.Nachname}`,
            });

            //Überprüfen ob User nicht schon vorhanden
            if (status == 200) {
              //Zeigt aktuellen code an --> FÜR TESTZWECKE MUSS DANN WEG!!!!
              console.log('Code: ' + code);
              //Authcode setzen um ihn dann zum bestäigen überprüfen zu können
              this.gotAuthCode = code;
              //Lässt Authcode-Ansicht öffnen
              this.dialog = true;
            }
          } catch {
            this.showError = true;
            this.errorText =
              'Der User ist bereits vorhanden. Bitte nehmen Sie eine andere Email Adresse';

            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });

            setTimeout(() => {
              this.showError = false;
              this.errorText = '';
            }, 5000);
            this.dialog = false;
            this.clearFelder();
          }
        } else {
          this.showError = true;
          this.errorText = 'Die beiden Passworter stimmen leider nicht überein';
          this.Passwort1 = '';
          this.Passwort2 = '';

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });

          setTimeout(() => {
            this.showError = false;
            this.errorText = '';
          }, 5000);
        }
      }
    },

    goToLogin() {
      localStorage.setItem('everLoggedIn', 'true');
      location.reload();
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
.chs-card {
  padding-top: 3rem;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 60rem;
}
.chs-button {
  background-color: rgba(255, 0, 0, 0) !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14),
    0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
  border: 2px solid #000000;
  border-radius: 20px;
}
.chs-button:hover {
  background-color: rgb(0, 0, 0) !important;
  color: white !important;
  transition: all 0.5s;
}
.chs-register {
  background-color: rgba(255, 255, 255, 0);
}
</style>
