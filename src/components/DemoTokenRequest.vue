<template>
  <Butt v-if="tokenRequests === 0" @clicked="requestTokens()">Gimme tokens plz!</Butt>
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
