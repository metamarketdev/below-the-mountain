<template>
  <ItemGroup title="Claims">
    <div v-if="loadingClaims">Loading...</div>

    <div v-else>
      <Recipe
        v-for="(recipe, i) in filteredRecipes"
        :key="i"
        :recipe="recipe"
        @click="openCraftModal(recipe)"
      />
    </div>
  </ItemGroup>

  <Modal :open="showMintingModal" @close="showMintingModal = false">
    <template v-slot:title>Mint {{ x }}:{{ y }}:{{ z }}</template>

    <div v-if="isMinting">Minting...</div>

    <div v-else class="w-screen max-w-xl">
      <Cta size="big" @make="mintClaim(x, y, z)">Mint</Cta>
    </div>
  </Modal>
</template>

<script>
import contracts from '../../contracts';
import Moralis from '../../plugins/moralis';
import Modal from '../Modal.vue';
import Cta from '../Cta.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Land',

  components: { Modal, Cta },

  data() {
    return {
      x: 0,
      y: 0,
      z: 0,

      loadingClaims: false,
      claims: [],
      isMinting: false,
      claimsContract: null,

      contractState: {
        mapSize: 0,
        maxDepth: 0,
      },
    };
  },

  async mounted() {
    await this.fetchContractState();
  },

  methods: {
    async mintClaim(x, y, z) {
      console.log('mintClaim', x, y, z);

      const sendOptions = {
        contractAddress: contracts.claims.address,
        functionName: 'mintClaim',
        abi: contracts.claims.abi,
        params: {
          x,
          y,
          z,
        },
      };

      const transaction = await Moralis.executeFunction(sendOptions);
      this.isMinting = true;
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

      this.isMinting = false;
    },

    async fetchContractState() {
      this.loadingClaims = true;

      const web3Provider = await Moralis.enableWeb3();
      const ethers = Moralis.web3Library;

      this.claimsContract = new ethers.Contract(
        contracts.claims.address,
        contracts.claims.abi,
        web3Provider,
      );

      console.log(this.claimsContract);

      this.contractState = {
        mapSize: await this.claimsContract.mapSize(),
        maxDepth: await this.claimsContract.maxDepth(),
      };

      let claims = [];

      for (let i = 1; i <= numRecipes; i++) {
        let recipe = await this.claimsContract._recipeDetails(i);
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

      console.log(claims);

      this.claims = claims;

      this.loadingClaims = false;
    },
  },
};
</script>

<style></style>
