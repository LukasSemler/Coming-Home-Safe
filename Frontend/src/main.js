import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.config.productionTip = false;

//! EIGENTLICH UNBRAUCHBAR WIR NUTZEN MAPBOX NICHT GOOGLE!
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCae4CWsdrdAYQ4LtnlX5Byhhfxfb7E5eA',
    libraries: 'places',
  },
});

//Base-URL axios
if (location.origin === 'http://localhost:8080') {
  axios.defaults.baseURL = 'http://localhost:2410';
}

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
