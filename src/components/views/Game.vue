<template>
  <div class="flex flex-row items-start">
    <nav class="flex flex-col justify-between p-2 bg-gray-900 w-52 h-screen">
      <div class="flex flex-col">
        <router-link to="/app">
          <h1 class="mb-2 text-lg">TODO: LOGO</h1>
          <!-- TODO: Beta/testnet flag -->
        </router-link>
        <GameNavLink to="/app/inventory" icon="ViewGridIcon">Inventory</GameNavLink>
        <GameNavLink to="/app/mine" icon="CubeIcon">Mine</GameNavLink>
        <GameNavLink to="/app/craft" icon="BeakerIcon">Craft</GameNavLink>
        <GameNavLink to="/app/land" icon="FlagIcon">Land</GameNavLink>
      </div>

      <div>
        <div class="flex flex-row items-center gap-2 mb-4">
          <router-link to="/">
            <HomeIcon class="w-6 h-6 text-gray-600 hover:text-gray-200" />
          </router-link>

          <a href="https://discord.gg/yWxXYxbpB6" target="_blank">
            <i class="fab fa-discord fa-lg text-gray-600 hover:text-purple-600 text-xl"></i>
          </a>
        </div>

        <div class="flex flex-row items-center gap-2">
          <a href="https://moralis.io" target="_blank" v-tooltip="'Powered by Moralis.io'">
            <img src="/moralis-logo/SVG/Moralis-Icon-Light.svg" alt="Moralis.io" class="w-8 h-8" />
          </a>
          <a href="https://avax.network" target="_blank" v-tooltip="'Powered by Avalanche'">
            <img src="/Avalanche_AVAX_RedWhite.png" alt="Avalanche" class="w-8 h-8" />
          </a>
        </div>
      </div>
    </nav>

    <div class="flex flex-col flex-grow p-4">
      <h2 class="font-title text-4xl text-left">{{ $route.name }}</h2>

      <div class="flex w-full mt-2 text-left rounded bg-stone-900 p-4">
        <router-view />
      </div>
    </div>
  </div>

  <div class="fixed top-0 right-0 flex flex-row p-2">
    <UserMenu class="fixed top-2 right-2" />
  </div>
</template>

<script>
import Nav from '../Nav.vue';
import UserMenu from '../UserMenu.vue';
import GameNavLink from '../GameNavLink.vue';
import { HomeIcon } from '@heroicons/vue/solid';

export default {
  name: 'Game',
  components: {
    GameNavLink,
    Nav,
    UserMenu,
    HomeIcon,
  },
};
</script>

<style></style>
