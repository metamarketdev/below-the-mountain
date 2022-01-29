<template>
  <Item v-for="item in $store.state.items" :key="item.id" :item="item" />
  <Item v-for="item in $store.state.pendingItems" :key="item.id" :item="item" />
</template>

<script>
import Item from '../Item.vue';

export default {
  name: 'Inventory',

  components: { Item },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.loadGems();
      // this.loadPendingGems();
      // this.listenToNewNfts();
    },

    async loadGems() {},
  },
};
</script>

<style></style>
