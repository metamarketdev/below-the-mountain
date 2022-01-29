<template>
  <ItemGroup title="Available Materials">
    <Item v-for="item in $store.state.items" :key="item.id" :item="item" />
    <Item v-for="item in $store.state.pendingItems" :key="item.id" :item="item" />
  </ItemGroup>
</template>

<script>
import contracts from '../../contracts';
import Moralis from '../../plugins/moralis';
import Item from '../Item.vue';
import ItemGroup from '../ItemGroup.vue';

// const erc20abi = require('../../abi/IERC20.json');
let ethers;

export default {
  name: 'Craft',

  components: { Item, ItemGroup },

  data() {
    return {
      recipes: [],
      craftingContract: null,
    };
  },

  async mounted() {
    await this.initWeb3();
    await this.fetchContractState();
  },

  methods: {
    async initWeb3() {
      ethers = Moralis.web3Library;

      console.log(contracts.crafting.abi);

      this.craftingContract = new ethers.Contract(
        contracts.crafting.address,
        contracts.crafting.abi,
      );

      console.log(this.craftingContract);
    },

    async fetchContractState() {
      const numRecipes = await this.craftingContract.numRecipes();
      console.log({ numRecipes });
      setTimeout(this.fetchContractState, 5000);
    },
  },
};
</script>
