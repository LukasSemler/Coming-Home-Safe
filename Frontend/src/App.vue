<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-footer dark padless>
      <v-card class="flex" flat tile>
        <v-card-title class="light-blue accent-3">
          <strong class="subheading">Get connected with us on social networks!</strong>

          <v-spacer></v-spacer>

          <v-btn v-for="icon in icons" :key="icon.name" class="mx-4" dark icon>
            <v-icon size="24px" :href="icon.link">
              {{ icon.name }}
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} — <strong>Coming-Home-Safe</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      icons: [
        { name: 'mdi-facebook', link: 'https://www.facebook.com/verena.bogner.18' },
        { name: 'mdi-twitter', link: 'https://twitter.com/nocturna_kreat?lang=de' },
        { name: 'mdi-instagram', link: 'https://www.instagram.com/coming_home_safe/' },
        { name: 'mdi-whatsapp', link: 'https://www.youtube.com/channel/UC-yA5-vcD_MVDPgKKzEmlrQ' },
        { name: 'mdi-youtube', link: 'https://wa.me/43681/10368601' },
      ],
    };
  },
};
</script>
