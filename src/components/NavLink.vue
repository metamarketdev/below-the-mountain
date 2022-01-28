<template>
  <router-link
    :to="to"
    class="hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md"
    active-class="bg-gray-200"
  >
    <slot />
  </router-link>
</template>

<script>
export default {
  name: 'NavLink',

  props: ['to'],

  computed: {
    isActive() {
      console.log(this);
      return this.$refs.link;
    },
  },
};
</script>
