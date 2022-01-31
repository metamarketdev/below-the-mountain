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

  <Modal :open="showCraftingModal" @close="closeCraftModal">
    <template v-slot:title>{{ selectedRecipe.name }}</template>

    <div v-if="craftingFailed">Failed :(</div>
    <div v-else-if="isCrafting && craftingSubmitted">Crafting item...</div>
    <div v-else-if="isCrafting">Sending transaction...</div>
    <div v-else-if="craftingSuccess">
      Success!
      <a :href="`https://testnet.snowtrace.io/tx/${craftingTx}`" target="_blank" class="underline">
        View transaction
      </a>
    </div>

    <template v-else>
      <div class="flex flex-row items-center justify-center">
        <Item
          :item="selectedRecipe.inputItem"
          :amount="selectedRecipe.inputAmount"
          :error="selectedRecipe.possibleAmount === 0"
        />
        <ArrowSmRightIcon class="w-12 text-gray-600" />
        <Recipe :recipe="selectedRecipe" :amount="amount" />
      </div>

      <div class="flex flex-row justify-center mt-4">
        <Butt
          size="big"
          :disabled="selectedRecipe.possibleAmount === 0"
          @click="makeRecipe(selectedRecipe, amount)"
        >
          Craft {{ amount }}
        </Butt>
      </div>
    </template>
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
      loadingRecipes: false,
      recipes: [],
      onlyPossible: false,
      showCraftingModal: false,
      selectedRecipe: null,
      amount: 1,
      craftingContract: null,

      isCrafting: false,
      craftingSubmitted: false,
      craftingSuccess: false,
      craftingFailed: false,
      craftingTx: '',
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
      this.showCraftingModal = true;
      this.craftingSuccess = false;
      this.craftingSubmitted = false;
      this.craftingFailed = false;
      this.craftingTx = '';
    },

    closeCraftModal() {
      this.showCraftingModal = false;
    },

    async makeRecipe(recipe, amount) {
      this.isCrafting = true;

      try {
        const transaction = await callMethod('crafting', 'makeRecipe', {
          recipeId: recipe.recipeId,
          amount,
        });

        this.craftingSubmitted = true;

        const result = await transaction.wait();
        if (result.status === 1) {
          console.log('success');
          this.craftingSuccess = true;
          this.craftingTx = result.transactionHash;
        } else {
          throw Error(result);
        }
      } catch (err) {
        this.craftingFailed = true;
        console.error('Failed to craft', err);
      }

      this.isCrafting = false;
    },

    async fetchContractState() {
      this.loadingRecipes = true;

      let numRecipes = await callMethod('crafting', 'numRecipes');
      numRecipes = numRecipes.toNumber();

      let recipes = [];

      for (let i = 1; i <= numRecipes; i++) {
        let recipe = await callMethod('crafting', '_recipeDetails', { recipeId: i });
        let toolType = await callMethod('tools', '_toolTypes', {
          toolTypeId: recipe.outputTokenType,
        });
        // let recipe = await toolsContract._(i);

        // IMPROVEMENT: make this more future-proof
        if (recipe.enabled) {
          recipe = {
            ...recipe,
            inputAmount: recipe.inputAmount.toNumber(),
            inputTokenId: recipe.inputTokenId.toString(),
            outputTokenType: toolType,
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
