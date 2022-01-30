<template>
  <Notice v-if="tokenRequests === 0">
    Looks like it's your first time here. Request some demo tokens to try out the app.

    <template v-slot:buttons>
      <Butt @clicked="requestTokens()" icon="gift">Gimme tokens plz!</Butt>
    </template>
  </Notice>
</template>

<script>
import contracts from '../contracts';
import Moralis from '../plugins/moralis';

export default {
  name: 'DemoTokenRequest',

  data() {
    return {
      isRequesting: false,
      faucetContract: null,
      tokenRequests: 0,
    };
  },

  mounted() {
    this.fetchContractState();
  },

  methods: {
    async fetchContractState() {
      const sendOptions = {
        contractAddress: contracts.faucet.address,
        functionName: 'getRequests',
        abi: contracts.faucet.abi,
      };

      const tokenRequests = await Moralis.executeFunction(sendOptions);
      this.tokenRequests = tokenRequests.toNumber();
    },

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
