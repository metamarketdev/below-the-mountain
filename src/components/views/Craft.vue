<template>
  <ItemGroup title="Recipes" :loading="loadingRecipes" :empty="filteredRecipes.length === 0">
    <Recipe
      v-for="(recipe, i) in filteredRecipes"
      :key="i"
      :recipe="recipe"
      @click="openCraftModal(recipe)"
    />
  </ItemGroup>

  <ItemGroup
    title="Available Materials"
    :loading="$store.state.loadingItems"
    :empty="allItems.length === 0"
  >
    <Item v-for="item in allItems" :key="item.id" :item="item" />
  </ItemGroup>

  <Modal :open="showCraftingModal" @close="showCraftingModal = false">
    <template v-slot:title>{{ selectedRecipe.name }}</template>

    <!-- {{ selectedRecipe.inputTokenId }} x {{ selectedRecipe.inputAmount }} -->
    <div class="flex flex-row items-center justify-center">
      <Item :item="selectedRecipe.inputItem" :amount="amount" />
      <ArrowSmRightIcon class="w-12 text-gray-600" />
      <Recipe :recipe="selectedRecipe" :amount="amount" />
    </div>

    <div v-if="isCrafting">Crafting...</div>

    <div v-else class="flex flex-row justify-center mt-4">
      <Butt size="big" @click="makeRecipe(selectedRecipe, amount)">Craft {{ amount }}</Butt>
    </div>
  </Modal>
</template>

<script>
import { callMethod } from '../../contracts';
import ItemGroup from '../ItemGroup.vue';
import Item from '../Item.vue';
import Recipe from '../Recipe.vue';
import { mapGetters } from 'vuex';
import { ArrowSmRightIcon } from '@heroicons/vue/outline';

export default {
  name: 'Craft',

  components: { Recipe, ItemGroup, Item, ArrowSmRightIcon },

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
            return item.attributes.token_id === recipe.inputTokenId;
          });

          if (inputItem) {
            recipe.possibleAmount = Math.floor(inputItem.attributes.amount / recipe.inputAmount);
          } else {
            recipe.possibleAmount = 0;
          }

          recipe.inputItem = inputItem;

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
      console.log(recipe);
      this.showCraftingModal = true;
    },

    async makeRecipe(recipe, amount) {
      const transaction = await callMethod('crafting', 'makeRecipe', {
        recipeId: recipe.recipeId,
        amount,
      });

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

      let numRecipes = await callMethod('crafting', 'numRecipes');
      numRecipes = numRecipes.toNumber();
      console.log({ numRecipes });

      let recipes = [];

      for (let i = 1; i <= numRecipes; i++) {
        console.log({ i });
        let recipe = await callMethod('crafting', '_recipeDetails', { recipeId: i });
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
