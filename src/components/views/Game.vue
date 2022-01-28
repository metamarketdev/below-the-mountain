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

      <a href="https://discord.gg/yWxXYxbpB6" target="_blank">
        <i class="fab fa-discord fa-lg hover:text-purple-600"></i>
      </a>
    </nav>

    <div class="p-4">
      <h2 class="font-title text-4xl">{{ $route.name }}</h2>

      <div class="w-full mt-2 text-left border">
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

export default {
  components: {
    GameNavLink,
    Nav,
    UserMenu,
  },
};
</script>

<style></style>
