<template>
  <VTooltip :delay="0" :instantMove="true">
    <div
      class="relative bg-gray-700 border border-gray-600 border-b-4 p-2 rounded-md inline-block m-1"
    >
      <div class="flex flex-row justify-between">
        <!-- <div class="text-left">
        <div class="text-xs">#{{ gem.id }}</div>
      </div> -->
        <!--
      <div class="text-right">
        <div class="text-xs text-gray-500">{{ gem.luster }}</div>
        <div class="text-xs text-gray-500">{{ gem.color }}</div>
        <div class="text-xs text-gray-500">lvl. {{ gem.level }}</div>
      </div> -->
      </div>

      <div class="text-center">
        <img :src="src" :alt="metadata.name" width="80" height="80" class="inline-block" />
      </div>

      <div
        class="absolute px-1 py-0 rounded-tl-md bg-gray-600 bottom-0 right-0 text-md text-gray-300"
      >
        {{ item.attributes.amount }}
      </div>
    </div>

    <template #popper>
      <div v-if="metadata.name" class="font-normal text-gray-200">{{ metadata.name }}</div>
      <div v-if="metadata.description" class="font-light text-sm text-gray-400">
        {{ metadata.description }}
      </div>
    </template>
  </VTooltip>
</template>

<script>
export default {
  name: 'Item',

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    metadata() {
      return JSON.parse(this.item.attributes.token_uri);
    },

    src() {
      const hash = this.metadata.image.split('://')[1];
      return 'https://gateway.pinata.cloud/ipfs/' + hash;
    },
  },
};
</script>

<style lang="css">
.v-popper__popper.v-popper__popper--show-from .v-popper__wrapper {
  transform: scale(0.9);
  opacity: 0;
}

.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  transform: none;
  transition: transform 0.1s;
}
</style>
