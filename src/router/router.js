import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/views/Home.vue';
import Game from '../components/views/Game.vue';
import Craft from '../components/views/Craft.vue';
import Mine from '../components/views/Mine.vue';
import Land from '../components/views/Land.vue';
import Inventory from '../components/views/Inventory.vue';

const routes = [
  { path: '/', component: Home },

  {
    path: '/app',
    component: Game,
    redirect: '/app/inventory',

    children: [
      {
        path: 'inventory',
        name: 'inventory',
        component: Inventory,
      },

      {
        path: 'mine',
        name: 'mine',
        component: Mine,
      },

      {
        path: 'craft',
        name: 'craft',
        component: Craft,
      },

      {
        path: 'land',
        name: 'land',
        component: Land,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
