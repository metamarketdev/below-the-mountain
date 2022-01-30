<template>
  <Butt @click="requestTokens()">Gimme tokens plz!</Butt>
</template>

<script>
import contracts from '../contracts';
import Moralis from '../plugins/moralis';

export default {
  name: 'DemoTokenRequest',

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

  methods: {
    async requestTokens() {


      const sendOptions = {
        contractAddress: contracts.faucet.address,
        functionName: 'requestTokens',
        abi: contracts.faucet.abi,
      };

      const transaction = await Moralis.executeFunction(sendOptions);
      this.isRequesting = true;
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

      this.isRequesting = false;
    },
  },
};
</script>
