import Vue from 'vue';
import VueRouter from 'vue-router';
import Login_Register from '../views/Login_Register.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login_Register',
    component: Login_Register,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
