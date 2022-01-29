<template>
  <div class="flex flex-row items-start">
    <GameNav />

    <div class="flex flex-col flex-grow p-4">
      <h2 class="font-title text-4xl text-left mb-12">{{ $route.name }}</h2>

      <router-view />
    </div>
  </div>

  <div class="fixed top-0 right-0 flex flex-row p-2">
    <UserMenu class="fixed top-2 right-2" />
  </div>
</template>

<script>
import UserMenu from '../UserMenu.vue';
import GameNav from '../GameNav.vue';

export default {
  name: 'Game',

  components: {
    GameNav,
    UserMenu,
  },
};
</script>

<style></style>
