<template>
  <v-container>
    <!--UserInteraktionen-->
    <v-row>
      <v-col class="text-right">
        <!--Passwort wechseln-->
        <v-dialog v-model="changePwDialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mr-2" color="primary" dark v-bind="attrs" v-on="on">
              Passwort ändern
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Passwort ändern</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <!--PasswordFeld-1-->
                  <v-col cols="12">
                    <v-text-field
                      v-model="changePw_Password_1"
                      min="1"
                      label="Passwort"
                      type="password"
                      required
                    ></v-text-field>
                  </v-col>
                  <!--PasswordFeld-2-->
                  <v-col cols="12">
                    <v-text-field
                      v-model="changePw_Password_2"
                      min="1"
                      label="Passwort bestätigen"
                      type="password"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*Verpflichtend</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="changePwDialog = false"> Schließen </v-btn>
              <v-btn color="green darken-1" text @click="changePassword"> Ändern </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--Abmelden-Button-->
        <v-btn outlined text class="red accent-3 justify-right" @click="abmelden"> Abmelden </v-btn>
      </v-col>
    </v-row>

    <!--Google Maps Component-->
    <userMap :logoutClickedStatus="logoutClickedStatus" />

    <!--Alert-->
    <v-row justify="center" class="mt-3" style="position: sticky; bottom: 2%">
      <v-alert
        width="30%"
        v-model="changePw_Alert_Show"
        :color="this.changePw_Alert_Color"
        border="bottom"
        type="success"
        >{{ changePw_Alert_Text }}</v-alert
      >
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import userMap from '../components/userMap.vue';

export default {
  name: 'Map',
  data() {
    return {
      changePwDialog: false,
      changePw_Password_1: '',
      changePw_Password_2: '',
      changePw_Alert_Show: false,
      changePw_Alert_Color: null,
      changePw_Alert_Text: '',
      changePw_Alert_Type: '',
      logoutClickedStatus: false,
    };
  },

  components: { userMap },

  methods: {
    async abmelden() {
      //Der Usermap sagen, dass WS-Verbindung getrennt werden soll
      this.logoutClickedStatus = true;

      //WIchtig um sessin zu beenden
      await axios.get(`/abmelden`);

      // Kunden aus Store löschen
      this.$store.dispatch('LogoutKunde');

      // Zurück zur Startseite
      this.$router.push('/');
    },

    async changePassword() {
      if (this.changePw_Password_1 == this.changePw_Password_2) {
        let { data: dataText, status } = await axios.patch(
          `/changeUserPassword/${this.$store.state.aktiverUser.email}`,
          { newPw: this.changePw_Password_1 },
        );

        //Feedback-Alert
        if (status == 200) {
          this.changePw_Alert_Color = 'green';
          this.changePw_Alert_Text = 'Passwort wurde erfolgreich geändert !';
          this.changePw_Alert_Type = 'success';
          this.changePw_Alert_Show = true;
        } else {
          this.changePw_Alert_Color = 'red';
          this.changePw_Alert_Text = 'Es ist ein Fehler beim Ändern vom Passwort aufgetreten';
          this.changePw_Alert_Type = 'error';
          this.changePw_Alert_Show = true;
        }
        setTimeout(() => {
          this.changePw_Alert_Show = false;
        }, 3000);

        //Dialogfenster wieder schließen
        this.changePwDialog = false;
      } else {
        alert('Leider sind die Passwörter nicht ident!');

        //Passwortfelder wieder clearen
        this.changePw_Password_1 = this.changePw_Password_2 = '';
      }
    },
  },
  mounted() {
    console.log(
      `Aktueller User: ${this.$store.state.aktiverUser.vorname} ${this.$store.state.aktiverUser.nachname}`,
    );
  },
};
</script>

<style></style>
