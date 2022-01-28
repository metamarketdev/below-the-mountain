<template>
  <button @click="toggleTheme()" class="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
    <SunIcon v-if="!dark" class="w-5 h-5 text-gray-500" />
    <MoonIcon v-if="dark" class="w-5 h-5 text-gray-500" />
  </button>
</template>

<script>
import { SunIcon, MoonIcon } from '@heroicons/vue/outline';

export default {
  name: 'ThemeToggle',

  components: {
    SunIcon,
    MoonIcon,
  },

  data() {
    return {
      dark: false,
    };
  },

  mounted() {
    this.applyTheme();
  },

  methods: {
    applyTheme() {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.dark = true;
        document.documentElement.classList.add('dark');
      } else {
        this.dark = false;
        document.documentElement.classList.remove('dark');
      }
    },

    toggleTheme() {
      this.dark = localStorage.theme === 'dark';
      localStorage.theme = localStorage.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme();
    },

    resetTheme() {
      localStorage.removeItem('theme');
      this.applyTheme();
    },
  },
};
</script>

<style></style>
