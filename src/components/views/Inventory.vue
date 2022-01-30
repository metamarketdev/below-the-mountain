<template>
  <ItemGroup title="Tools" :loading="$store.state.loadingItems" :empty="allTools.length === 0">
    <Item v-for="item in allTools" :key="item.id" :item="item" :hideAmount="true" />
  </ItemGroup>

  <ItemGroup title="Materials" :loading="$store.state.loadingItems" :empty="allItems.length === 0">
    <Item v-for="item in allItems" :key="item.id" :item="item" />
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
