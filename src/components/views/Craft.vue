<template>
  <ItemGroup title="Recipes">
    <div v-if="loadingRecipes">Loading...</div>

    <div v-else>
      <Recipe
        v-for="(recipe, i) in filteredRecipes"
        :key="i"
        :recipe="recipe"
        @click="openCraftModal(recipe)"
      />
    </div>
  </ItemGroup>

  <ItemGroup title="Available Materials">
    <Item v-for="item in allItems" :key="item.id" :item="item" />
  </ItemGroup>

  <Modal :open="showCraftingModal" @close="showCraftingModal = false">
    <template v-slot:title>{{ selectedRecipe.name }}</template>

    <div v-if="isCrafting">Crafting...</div>

    <div v-else class="w-screen max-w-xl">
      <Butt size="big" @click="makeRecipe(selectedRecipe, amount)">Craft {{ amount }}</Butt>
    </div>
  </Modal>
</template>

<script>
import contracts from '../../contracts';
import Moralis from '../../plugins/moralis';
import ItemGroup from '../ItemGroup.vue';
import Item from '../Item.vue';
import Recipe from '../Recipe.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Craft',

  components: { Recipe, ItemGroup, Item },

  data() {
    return {
      isCrafting: false,
      loadingRecipes: false,
      recipes: [],
      onlyPossible: false,
      showCraftingModal: false,
      selectedRecipe: null,
      amount: 1,
      craftingContract: null,
    };
  },

  async mounted() {
    await this.fetchContractState();
  },

  computed: {
    ...mapGetters(['allItems', 'allTools']),

    filteredRecipes() {
      return this.recipes
        .map((recipe) => {
          const inputItem = this.allItems.find((item) => {
            console.log(item.attributes.token_id, recipe.inputTokenId);
            return item.attributes.token_id === recipe.inputTokenId;
          });

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
    openCraftModal(recipe) {
      this.selectedRecipe = recipe;
      this.showCraftingModal = true;
    },

    async makeRecipe(recipeId, amount) {
      console.log('makeRecipe', { recipeId, amount });

      const sendOptions = {
        contractAddress: contracts.crafting.address,
        functionName: 'makeRecipe',
        abi: contracts.crafting.abi,
        params: {
          recipeId,
          amount,
        },
      };

      const transaction = await Moralis.executeFunction(sendOptions);
      this.isCrafting = true;
      console.log(1, { transaction });

      // TODO: better event handler UX

      try {
        const result = await transaction.wait();
        if (result.status === 1) {
          console.log('success');
        }
      } catch (err) {
        console.error(err);
      }

      this.isCrafting = false;
    },

    async fetchContractState() {
      this.loadingRecipes = true;

      const web3Provider = await Moralis.enableWeb3();
      const ethers = Moralis.web3Library;

      // console.log('Crafting ABI:', contracts.crafting.abi);
      this.craftingContract = new ethers.Contract(
        contracts.crafting.address,
        contracts.crafting.abi,
        web3Provider,
        // this.$store.state.userAttributes.ethAddress,
      );

      let numRecipes = await this.craftingContract.numRecipes();
      numRecipes = numRecipes.toNumber();

      let recipes = [];

      for (let i = 1; i <= numRecipes; i++) {
        let recipe = await this.craftingContract._recipeDetails(i);
        // let recipe = await toolsContract._(i);

        // IMPROVEMENT: make this more future-proof
        if (recipe.enabled) {
          recipe = {
            ...recipe,
            inputAmount: recipe.inputAmount.toNumber(),
            inputTokenId: recipe.inputTokenId.toString(),
            outputTokenType: recipe.outputTokenType.toString(),
          };

          recipes.push(recipe);
        }
      }

      console.log(recipes);

      this.recipes = recipes;

      this.loadingRecipes = false;
    },
  },
};
</script>
