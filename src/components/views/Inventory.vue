<template>
  <ItemGroup title="Materials">
    <Item v-for="item in $store.state.items" :key="item.id" :item="item" />
    <Item v-for="item in $store.state.pendingItems" :key="item.id" :item="item" />
  </ItemGroup>

  <ItemGroup title="Tools">
    <Item v-for="item in $store.state.tools" :key="item.id" :item="item" />
    <Item v-for="item in $store.state.pendingTools" :key="item.id" :item="item" />
  </ItemGroup>
</template>

<script>
import Item from '../Item.vue';
import ItemGroup from '../ItemGroup.vue';

export default {
  name: 'Inventory',

  components: { Item, ItemGroup },

  mounted() {},
  methods: {},
};
</script>

<style></style>
