<template>
  <div v-if="title" class="font-title text-xl">{{ title }}</div>

  <div class="flex w-full text-left rounded bg-stone-900 p-4 mb-4">
    <slot />
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
  },
};
</script>
