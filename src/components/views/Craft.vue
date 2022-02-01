<template>
  <div class="text-gray-300 my-4">Select an item to craft. You need the required materials.</div>

  <ItemGroup title="Recipes" :loading="loadingRecipes" :empty="filteredRecipes.length === 0">
    <Recipe
      v-for="(recipe, i) in filteredRecipes"
      :key="i"
      :recipe="recipe"
      :hideAmount="true"
      @click="openCraftModal(recipe)"
    />
  </ItemGroup>

  <ItemGroup title="Available Materials" :loading="loadingItems" :empty="allItems.length === 0">
    <Item v-for="item in allItems" :key="item.id" :item="item" />
  </ItemGroup>

  <Modal :open="showCraftingModal" @close="closeCraftModal">
    <template v-slot:title>{{ selectedRecipe.name }}</template>

    <div v-if="craftingFailed">Failed :(</div>
    <div v-else-if="isCrafting && craftingSubmitted">Forging some gear...</div>
    <div v-else-if="isCrafting">Sending transaction...</div>
    <div v-else-if="craftingSuccess">
      Success!
      <br />

      <a
        :href="`https://testnet.snowtrace.io/tx/${craftingTx}`"
        target="_blank"
        class="underline text-gray-600"
      >
        View transaction
      </a>

      <Butt to="/app/inventory" class="mt-2">View in inventory</Butt>
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
import { mapGetters, mapState, mapActions } from 'vuex';
import { callMethod } from '../../contracts';
import ItemGroup from '../ItemGroup.vue';
import Item from '../Item.vue';
import Recipe from '../Recipe.vue';
import { ArrowSmRightIcon } from '@heroicons/vue/outline';

export default {
  name: 'Craft',

  components: { Recipe, ItemGroup, Item, ArrowSmRightIcon },

  data() {
    return {
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
    if (this.recipes.length === 0) {
      await this.loadRecipes();
    }
  },

  computed: {
    ...mapState(['loadingRecipes', 'recipes', 'loadingItems']),
    ...mapGetters(['allItems']),

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
    ...mapActions(['loadRecipes']),

    openCraftModal(recipe) {
      this.selectedRecipe = recipe;
      this.showCraftingModal = true;
      this.isCrafting = false;
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
  },
};
</script>
