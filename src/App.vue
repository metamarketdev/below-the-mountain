<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import 'floating-vue/dist/style.css';

export default {
  name: 'App',
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
