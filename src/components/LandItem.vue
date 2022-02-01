<template>
  <div
    @click="$emit(isMinted ? '' : 'clicked')"
    class="aspect-square rounded border transition-all cursor-pointer opacity-80 hover:opacity-100 bg-cover"
    :class="{
      'border-gray-600 bg-gray-700 border-b-4 scale-95 opacity:90': !isMinted,
      'border-sky-500 bg-gray-600 border-b-2': isMinted,
    }"
    :style="bgStyle"
  >
    #{{ tokenId }}
  </div>
</template>

<script>
import { callMethod } from '../contracts';

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

  mounted() {
    this.fetchData();
  },

  watch: {
    isMinted(to, from) {
      if (!from && to) {
        this.fetchData();
      }
    },
  },

  data() {
    return {
      claimDetails: {},
    };
  },

  computed: {
    src() {
      if (this.claimDetails && this.claimDetails.emblem) {
        return 'https://gateway.pinata.cloud/ipfs/' + this.claimDetails.emblem;
      } else {
        return '';
      }
    },

    bgStyle() {
      if (this.src) {
        return `background-image: url('${this.src}')`;
      } else {
        return null;
      }
    },
  },

  methods: {
    async fetchData() {
      if (this.isMinted) {
        this.claimDetails = await callMethod('claims', '_claimDetails', { claimId: this.tokenId });
      }
    },
  },
};
</script>
