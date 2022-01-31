<template>
  <button
    class="inline-block w-20 h-20 bg-cover rounded-md"
    @click="$emit('clicked')"
    :style="`background-image:url(${src})`"
  ></button>
</template>

<script>
// IMPROVEMENT: lazy load and handle rate-limiting

export default {
  name: 'AvatarButton',

  props: {
    token: {
      type: Object,
      required: true,
    },
  },

  computed: {
    metadata() {
      return JSON.parse(this.token.metadata);
    },

    src() {
      if (this.metadata.image.includes('ipfs://')) {
        const hash = this.metadata.image.split('://')[1];
        return 'https://ipfs.moralis.io:2053/ipfs/' + hash;
      } else {
        return this.metadata.image;
      }
    },
  },
};
</script>

<style></style>
