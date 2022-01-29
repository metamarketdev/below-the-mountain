<template>
  <GemItem v-for="item in $store.state.items" :key="item.id" :amount="item.amount" />
</template>

<script>
export default {
  components: {},

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
