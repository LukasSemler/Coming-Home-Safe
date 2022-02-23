import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aktiverUser: null,
  },

  //GETTERS
  getters: {
    //Hier schaut man ob der User eingelogt ist, bzw. einer existiert
    isAktiverUserVorhanden(state) {
      try {
        return state.aktiverUser ? true : false;
      } catch {
        return false;
      }
    },
  },

  //ACTIONS --> MUTATIONS
  actions: {
    LogoutKunde(context) {
      //Entfernt den Kunde vom Store
      context.commit('logoutKunde');
    },

    LoginKunde(context, neueKundeItem) {
      //Übergibt der Mutation den neuen Kunden
      context.commit('loginKunde', neueKundeItem);
    },
  },

  //MUTATIONS --> STATE
  mutations: {
    async logoutKunde(state) {
      //Entfernt den aktiven User
      state.aktiverUser = null;
    },

    async loginKunde(state, neueKundeItem) {
      //Setzt den neue Kunden im State
      state.aktiverUser = neueKundeItem;
    },
  },
});
