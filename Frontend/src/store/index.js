import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aktiverUser: null,
    currentPosition: null,
    aktiverUser: {}, 
    aktiverUserTest: {vorname: "Lukas", nachname: 'Semler', email: 'lukas.semler@gmail.com'}
  },
  mutations: {},
  actions: {},
  modules: {},
});
