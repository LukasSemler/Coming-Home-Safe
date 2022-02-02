import Vue from 'vue';
import VueRouter from 'vue-router';
import Login_Register from '../views/Login_Register.vue';
import Map from '../views/Maps';
import adminMap from '../views/adminMap';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login_Register',
    component: Login_Register,
  },
  {
    path: '/Map',
    name: 'Map',
    component: Map,
    //Schauen ob user angemeldet ist
    // beforeEnter: (to, from, next) => {
    // 	if (to.query.allowed === 'true') next();
    // 	else next('Error');
    // },
  },
  {
    path: '/adminMap',
    name: 'adminMap',
    component: adminMap,
    //Schauen ob user angemeldet ist
    // beforeEnter: (to, from, next) => {
    // 	if (to.query.allowed === 'true') next();
    // 	else next('Error');
    // },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
