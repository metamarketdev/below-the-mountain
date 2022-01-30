import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from './router/router';
import store from './store/store';
import Moralis from './plugins/moralis';
import { TroisJSVuePlugin } from 'troisjs';
import FloatingVue from 'floating-vue';
import { VTooltip } from 'floating-vue';
import VueKinesis from 'vue-kinesis';

const tooltipOptions = {
  themes: {
    'item-tooltip': {
      $extend: 'tooltip',
      delay: 0,
      // instantMove: true,
    },
  },
};

createApp(App)
  .provide('$moralis', Moralis)
  .use(store)
  .use(router)
  .use(FloatingVue, tooltipOptions)
  .use(TroisJSVuePlugin)
  .use(VueKinesis)
  .directive('tooltip', VTooltip)
  // .directive('close-popper', VClosePopper)
  .mount('#app');
