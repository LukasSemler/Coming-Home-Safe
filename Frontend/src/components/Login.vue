<template>
  <v-container class="chs-login">
    <br />
    <v-alert
      v-if="showError"
      shaped
      prominent
      type="error"
      transition="scroll-y-reverse-transition"
    >
      {{ errorText }}
    </v-alert>
    <v-dialog v-model="dialog" persistent max-width="450px">
      <!-- <template v-slot:activator="{ on, attrs }">
				Register-Button
				<v-btn color="primary" v-bind="attrs" @click="openOTP(on)"> Register </v-btn>
			</template> -->
      <v-card>
        <v-card-title>
          <span class="text-h5">2 Faktor Authentication</span>
        </v-card-title>
        <v-card-text>
          <v-otp-input
            length="5"
            class="my-3"
            @finish="sumbitAdminLogin"
          ></v-otp-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="red" @click="submitRegistration"> Submit </v-btn> -->
          <v-btn color="red darken-1" @click="close"> Cancle </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container class="" style="max-width: 40rem">
      <v-form ref="form" v-model="validLogin" lazy-validation>
        <v-container>
          <v-row class="justify-center">
            <v-col md="12" class="chs-card">
              <h2 class="text-left">Login</h2>
              <!--Email-->
              <v-row class="justify-center">
                <v-col md="12">
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
                <v-col md="12">
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
                  >
                    Passwort vergessen
                  </p>
                </v-col>
              </v-row>
              <!--Submit-->
              <v-row class="justify-center">
                <v-btn @click="submit" class="chs-button">Einloggen</v-btn>
              </v-row>

              <!--Register weiterleiten-->
              <br />
              <br />
              <v-row class="justify-center">
                <v-col md="12">
                  <p>
                    get Back to
                    <span
                      @click="goToRegister"
                      class="text-decoration-underline pointer"
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
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      email: "",
      passwort: "",
      showPasswordInput: false,
      showPasswortVergessen: false,
      validLogin: true,

      dialog: false,
      code: "",
      foundUser: null,

      errorText: "",
      showError: false,

      rules: {
        required: [(val) => (val || "").length > 0 || "This field is required"],
        EmailRules: [
          (value) => !!value || "This field is required.",
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
          },
        ],
      },
    };
  },
  methods: {
    clearFelder() {
      this.email = "";
      this.passwort = "";
    },
    close() {
      this.dialog = false;
      this.clearFelder();
    },

    sumbitAdminLogin(otpInputCode) {
      //Schaut ob OTPinput-Code und gesendeter Code gleich ist
      if (otpInputCode == this.code) {
        //Ever logged-in im LS speichern
        localStorage.setItem("everLoggedIn", true);

        //Aktiven Kunden im Store setzen
        this.$store.dispatch("LoginKunde", this.foundUser);

        //Zur Map weiterleiten
        this.$router.push("/map");

        //Schließt Dialog
        this.close();
        //Leitet zur Adminmap weiter
        this.$router.push("/AdminMap");
      } else {
        //gescheit Error meldung TODO:
        console.log("something went wrong");
      }
    },

    //Zu Register zu kommen
    goToRegister() {
      try {
        localStorage.removeItem("everLoggedIn");
        localStorage.setItem("everLoggedIn", false);
        location.reload();
      } catch (error) {}
    },

    async submit() {
      //Schaut ob der User ein Admin ist oder nicht, für richtige Weiterleitung (Map oder Adminmap)
      try {
        //Bekommt daten vom server (Gefundenen User und Code)
        let { status, data } = await axios.post(`${this.serverAdress}/login`, {
          email: this.email,
          passwort: this.passwort,
        });

        const { code, foundUser } = data;

        //Normaler User
        if (status == 200 && code == "kein Admin") {
          //Ever logged-in im LS speichern
          localStorage.setItem("everLoggedIn", true);

          //Aktiven Kunden im Store setzen
          this.$store.dispatch("LoginKunde", foundUser);

          //Zur Map weiterleiten
          this.$router.push("/map");
        }
        //AdminUser
        else if (status == 200 && code != "kein Admin") {
          //Code setzen
          this.code = code;
          //GefundenenUser setzen
          this.foundUser = foundUser;
          //OTP-Input öffnen
          this.dialog = true;
        }
      } catch {
        //Wenn user nicht vorhanden kommt ein alert
        this.showError = true;
        this.errorText =
          "Der User ist leider nicht vorhanden. Bitte erstellen Sie einen Account oder geben Sie die richtigen Daten an.";

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setTimeout(() => {
          this.showError = false;
          this.errorText = "";
        }, 5000);

        this.clearFelder();
      }
    },
  },
};
</script>

<style>
.pointer:hover {
  cursor: pointer;
}
.chs-card {
  padding: 4rem;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 45rem;
}
.chs-button {
  background-color: rgba(255, 0, 0, 0) !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
  border: 2px solid #000000;
  border-radius: 20px;
}
.chs-button:hover {
  background-color: rgb(0, 0, 0) !important;
  color: white !important;
  transition: all 0.5s;
}
.chs-login {
  background-color: rgba(255, 255, 255, 0);
}
</style>
