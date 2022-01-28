<template>
  <router-link
    :to="to"
    class="flex flex-row items-center p-2 rounded hover:bg-sky-500 hover:bg-opacity-50 text-gray-400 font-semibold group"
    active-class="text-gray-200"
    v-slot="{ isActive }"
  >
    <component
      :is="icon"
      class="w-5 h-5 text-stone-500 mr-2"
      :class="isActive ? 'text-sky-400' : 'text-gray-500'"
    />

    <slot />
  </router-link>
</template>

<script>
import { ViewGridIcon, CubeIcon, BeakerIcon, FlagIcon } from '@heroicons/vue/outline';

export default {
  name: 'GameNavLink',

  props: ['to', 'icon'],

  components: {
    ViewGridIcon,
    CubeIcon,
    BeakerIcon,
    FlagIcon,
  },
};
</script>
