<template>
  <ItemGroup title="Recipes">
    <div v-if="loadingRecipes">Loading...</div>

    <div v-else>
      <Recipe v-for="(recipe, i) in filteredRecipes" :key="i" :bind="recipe" />
    </div>
  </ItemGroup>

  <ItemGroup title="Available Materials">
    <Item v-for="item in $store.state.items" :key="item.id" :item="item" />
    <Item v-for="item in $store.state.pendingItems" :key="item.id" :item="item" />
  </ItemGroup>
</template>

<script>
import contracts from '../../contracts';
import Moralis from '../../plugins/moralis';
import ItemGroup from '../ItemGroup.vue';
import Recipe from '../Recipe.vue';

export default {
  name: 'Craft',

  components: { Recipe, ItemGroup },

  data() {
    return {
      loadingRecipes: false,
      recipes: [],
      onlyPossible: false,
      craftingContract: null,
    };
  },

  async mounted() {
    await this.fetchContractState();
  },

  computed: {
    filteredRecipes() {
      return this.recipes
        .map((recipe) => {
          const inputItem = this.$store.state.items.find(
            (item) => item.attributes.token_id === recipe.inputTokenId,
          );

          if (inputItem) {
            recipe.possibleAmount = Math.floor(inputItem.attributes.amount / recipe.inputAmount);
          } else {
            recipe.possibleAmount = 0;
          }

          return recipe;
        })
        .filter((recipe) => {
          if (this.onlyPossible) {
            return recipe.possibleAmount >= 1;
          } else {
            return true;
          }
        });
    },
  },

  methods: {
    async fetchContractState() {
      this.loadingRecipes = true;

      const web3Provider = await Moralis.enableWeb3();
      const ethers = Moralis.web3Library;
      // console.log('Crafting ABI:', contracts.crafting.abi);

      const craftingContract = new ethers.Contract(
        contracts.crafting.address,
        contracts.crafting.abi,
        web3Provider,
      );

      let numRecipes = await craftingContract.numRecipes();
      numRecipes = numRecipes.toNumber();

      let recipes = [];

      for (let i = 1; i <= numRecipes; i++) {
        let recipe = await craftingContract._recipeDetails(i);
        // let recipe = await toolsContract._(i);

        // IMPROVEMENT: make this more future-proof
        if (recipe.enabled) {
          recipe = {
            inputAmount: recipe.inputAmount.toNumber(),
            inputTokenId: recipe.inputTokenId.toNumber(),
            outputTokenType: recipe.outputTokenType.toNumber(),
          };

          recipes.push(recipe);
        }
      }

      this.recipes = recipes;

      this.loadingRecipes = false;
    },
  },
};
</script>
