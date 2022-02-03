import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aktiverUser: null,
    currentPosition: null,
    aktiverUserTest: { vorname: 'Lukas', nachname: 'Semler', email: 'lukas.semler@gmail.com' },
  },
  mutations: {
    async logoutKunde(state) {
      state.aktiverUser = null;
    },
  },
  getters: {
    //Hier schaut man ob der User eingelogt ist
    getLogin(state) {
      try {
        return state.aktiverUser ? true : false;
      } catch {
        return false;
      }
    },
  },
  actions: {
    LogoutKunde(context) {
      //Entfernt den Kunde vom Store
      context.commit('logoutKunde');
    },
  },
  modules: {},
});
