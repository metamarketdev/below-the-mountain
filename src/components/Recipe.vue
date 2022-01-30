<template>
  <VTooltip theme="item-tooltip" class="inline-block">
    <div
      @click="$emit('click')"
      class="relative border bg-gray-700 border-gray-600 border-b-4 p-2 rounded-md inline-block m-1"
      :class="{ 'hover:bg-gray-500 cursor-pointer': isPossible, 'opacity-50': !isPossible }"
    >
      <div class="text-center">
        {{ recipe.name }}
        <!-- <img :src="src" :alt="metadata.name" width="80" height="80" class="inline-block" /> -->
      </div>

      <div
        class="absolute px-1 py-0 rounded-tl-md bg-gray-600 bottom-0 right-0 text-md text-gray-300"
      >
        {{ amount || recipe.possibleAmount }}
      </div>
    </div>

    <template #popper>
      <div class="font-normal text-gray-200">
        {{ recipe.name }}
      </div>

      <div class="font-light text-sm text-gray-400">
        {{ recipe.inputTokenId }}:
        {{ recipe.inputAmount }}
      </div>
    </template>
  </VTooltip>
</template>

<script>
export default {
  name: 'Recipe',

  props: {
    recipe: {
      type: Object,
      required: true,
    },

    amount: {
      type: Number,
      required: false,
    },
  },

  computed: {
    isPossible() {
      return this.recipe.possibleAmount > 0;
    },

    metadata() {
      // console.log(this.item.attributes.token_uri);
      return JSON.parse(this.item.attributes.token_uri);
    },

    src() {
      const hash = this.metadata.image.split('://')[1];
      return 'https://gateway.pinata.cloud/ipfs/' + hash;
    },
  },
};
</script>

<style lang="scss">
$backgroundColor: rgb(1, 13, 20);

.v-popper__popper.v-popper--theme-item-tooltip {
  .v-popper__wrapper {
    min-width: 150px;
    max-width: 250px;
  }

  .v-popper__arrow-inner {
    visibility: visible;
    border-color: $backgroundColor;
  }

  .v-popper__inner {
    background: $backgroundColor;
  }

  &.v-popper__popper--show-from .v-popper__wrapper {
    transform: scale(0.95);
    opacity: 0;
  }

  &.v-popper__popper--show-to .v-popper__wrapper {
    transform: none;
    transition: transform 0.05s;
  }
}
</style>
