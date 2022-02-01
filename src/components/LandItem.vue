<template>
  <div
    @click="$emit(isMinted ? '' : 'clicked')"
    class="aspect-square rounded border transition-all cursor-pointer opacity-80 hover:opacity-100"
    :class="{
      'border-gray-600 bg-gray-700 border-b-4 scale-95 opacity:90': !isMinted,
      'border-sky-500 bg-gray-600 border-b-2': isMinted,
    }"
  >
    #{{ tokenId }}
  </div>
</template>

<script>
export default {
  name: 'LandItem',

  props: {
    tokenId: {
      type: Number,
      required: true,
    },

    isMinted: {
      type: Boolean,
      default: false,
    },
  },

  computed() {},
};
</script>
