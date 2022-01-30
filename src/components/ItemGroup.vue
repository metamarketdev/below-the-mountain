<template>
  <div v-if="title" class="font-title text-gray-500 text-xl">{{ title }}</div>

  <div class="w-full text-left rounded bg-stone-900 p-4 mb-4">
    <div v-if="loading">Loading...</div>
    <div v-else-if="empty">Nothing here.</div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemGroup',

  props: {
    title: {
      type: String,
      default: '',
    },

    empty: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
