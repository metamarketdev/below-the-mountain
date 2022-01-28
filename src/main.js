import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from './router/router';
import store from './store/store';
import Moralis from './plugins/moralis';
import { TroisJSVuePlugin } from 'troisjs';

createApp(App)
  .provide('$moralis', Moralis)
  .use(store)
  .use(router)
  .use(TroisJSVuePlugin)
  .mount('#app');
