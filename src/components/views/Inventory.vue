<template>
  <ItemGroup title="All Items">
    <Item v-for="item in allItems" :key="item.id" :item="item" />
  </ItemGroup>

  <ItemGroup title="Confirmed Items">
    <Item v-for="item in $store.state.confirmed.items" :key="item.id" :item="item" />
  </ItemGroup>

  <ItemGroup title="Pending Items">
    <Item v-for="item in $store.state.pending.items" :key="item.id" :item="item" />
  </ItemGroup>

  <ItemGroup title="All Tools">
    <Item v-for="item in allTools" :key="item.id" :item="item" />
  </ItemGroup>

  <ItemGroup title="Confirmed Tools">
    <Item v-for="item in $store.state.confirmed.tools" :key="item.id" :item="item" />
  </ItemGroup>

  <ItemGroup title="Pending Tools">
    <Item v-for="item in $store.state.pending.tools" :key="item.id" :item="item" />
  </ItemGroup>
</template>

<script>
import { mapGetters } from 'vuex';
import Item from '../Item.vue';
import ItemGroup from '../ItemGroup.vue';

export default {
  name: 'Inventory',

  components: { Item, ItemGroup },

  computed: {
    ...mapGetters(['allItems', 'allTools']),
  },
};
</script>

<style></style>
