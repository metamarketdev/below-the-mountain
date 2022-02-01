<template>
  <VTooltip theme="item-tooltip" class="inline-block">
    <div
      @click="$emit('click')"
      class="relative border bg-gray-700 cursor-pointer border-gray-600 border-b-4 p-2 rounded-md inline-block m-1"
      :class="{
        'hover:bg-gray-500': isPossible,
        'opacity-50': !isPossible,
      }"
    >
      <div class="text-center">
        <img :src="src" :alt="recipe.name" width="80" height="80" class="inline-block" />
      </div>

      <div v-if="!hideAmount"
        class="absolute px-1 py-0 rounded-tl-md bg-gray-600 bottom-0 right-0 text-md text-gray-300"
      >
        {{ amount || recipe.possibleAmount }}
      </div>
    </div>

    <template #popper>
      <div v-if="recipe.outputTokenType.name" class="font-normal text-gray-200">
        {{ recipe.outputTokenType.name }}
      </div>

      <div v-if="recipe.outputTokenType.description" class="font-light text-sm text-gray-400">
        {{ recipe.outputTokenType.description }}
      </div>

      <!-- <div v-if="metadata.bonuses" class="font-light text-sm text-indigo-400">
        <div v-for="(bonus, key) in metadata.bonuses" :key="key" class="capitalize">
          +{{ bonus }} {{ key }}
        </div>
      </div> -->
<!--
      <div class="font-light text-sm text-gray-400">
        {{ recipe.inputAmount }} :{{ recipe.inputToken }}
      </div> -->
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

    hideAmount: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isPossible() {
      return this.recipe.possibleAmount > 0;
    },

    src() {
      return 'https://ipfs.moralis.io:2053/ipfs/' + this.recipe.outputTokenType.image;
    },
  },
};
</script>
