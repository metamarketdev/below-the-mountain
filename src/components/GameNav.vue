<template>
  <nav class="flex flex-col justify-between p-2 bg-gray-900 w-52 shrink-0 h-screen sticky top-0">
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
        <a
          href="https://moralis.io"
          target="_blank"
          v-tooltip="'Powered by Moralis.io'"
          class="scale-90 will-change-transform hover:scale-100 transition-all"
        >
          <img src="/moralis-logo/SVG/Moralis-Icon-Light.svg" alt="Moralis.io" class="w-8 h-8" />
        </a>
        <a
          href="https://avax.network"
          target="_blank"
          v-tooltip="'Powered by Avalanche'"
          class="scale-90 will-change-transform hover:scale-100 transition-all"
        >
          <img src="/Avalanche_AVAX_RedWhite.png" alt="Avalanche" class="w-8 h-8" />
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import GameNavLink from './GameNavLink.vue';
import { HomeIcon } from '@heroicons/vue/solid';

export default {
  name: 'GameNav',

  components: {
    GameNavLink,
    HomeIcon,
  },
};
</script>
