<template>
  <template v-if="!$store.state.loadingBalances">
    <Notice v-if="$store.state.balance < 0.01">
      You need some testnet AVAX to interact with the app.

      <template v-slot:buttons>
        <Butt
          :href="`https:faucet.avax-test.network?address=${$store.state.userAttributes.ethAddress}`"
          color="red"
          class="inline-block"
          icon="arrow-up-right-from-square"
        >
          Get testnet AVAX
        </Butt>
      </template>
    </Notice>

    <Notice v-else-if="showTokensNotice">
      Looks like it's your first time here. Request some demo tokens to try out the app.

      <template v-slot:buttons>
        <Butt @clicked="requestTokens()" icon="gift">Gimme tokens plz!</Butt>
      </template>
    </Notice>
  </template>
</template>

<script>
import { callMethod } from '../contracts';

export default {
  name: 'OnboardingNotice',

  data() {
    return {
      loadingContractState: true,
      isRequesting: true,
      faucetContract: null,
      tokenRequests: 0,
      requestSucceeded: false,
      timeout: null,
      fetchedContractState: false,
    };
  },

  mounted() {
    this.fetchContractState();
  },

  unmounted() {
    clearTimeout(this.timeout);
  },

  computed: {
    showTokensNotice() {
      return this.fetchedContractState && this.tokenRequests === 0 && !this.requestSucceeded;
    },
  },

  methods: {
    async fetchContractState() {
      if (this.$store.getters.isAuthenticated) {
        const tokenRequests = await callMethod('faucet', 'getRequests');
        this.tokenRequests = tokenRequests.toNumber();
        this.timeout = setTimeout(this.fetchContractState, 10000);
        this.fetchedContractState = true;
      }
    },

    async requestTokens() {
      const transaction = await callMethod('faucet', 'requestTokens');
      this.isRequesting = true;
      console.log(1, { transaction });

      // TODO: better event handler UX

      try {
        const result = await transaction.wait();
        if (result.status === 1) {
          this.requestSucceeded = true;
        }
      } catch (err) {
        console.error(err);
      }

      this.isRequesting = false;
    },
  },
};
</script>
