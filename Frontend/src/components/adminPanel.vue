<template>
  <v-container>
    <h2 class="text-center">Comp Admin Panel</h2>
    <br />
    <v-simple-table dark>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Vorname</th>
            <th class="text-left">Nachname</th>
            <th class="text-left">Email</th>
            <th class="text-left">Ist Admin</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.k_id">
            <td>{{ item.vorname }}</td>
            <td>{{ item.nachname }}</td>
            <td>{{ item.email }}</td>
            <td>
              <v-btn @click="changeAdmin(item)" v-if="!item.isadmin" class="red"
                >Nein</v-btn
              >
              <v-btn @click="changeAdmin(item)" v-else class="green">Ja</v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "adminPanel",
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      users: [],
    };
  },
  async created() {
    //Alle User bekommen um sie darzustellen
    const res = await axios.get(`/getUsers`);
    this.users = res.data;
  },
  methods: {
    async changeAdmin(user) {
      console.log(user);
      user.isadmin = !user.isadmin;

      const res = await axios.patch(
        `/patchAdmin/${user.k_id}`,
        {
          value: user.isadmin,
        }
      );
      console.log(res);
    },
  },
};
</script>

<style>

</style>
