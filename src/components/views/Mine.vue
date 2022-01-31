<template>
  <div class="text-gray-300 my-4">
    Use a tool to mine a specific location. The owner of the mine gets a fee.
  </div>

  <ItemGroup title="SELECT TOOL" :loading="loadingItems" :empty="allTools.length === 0">
    <Item
      v-for="item in allTools"
      :key="item.id"
      :item="item"
      :hideAmount="true"
      :selected="selectedTool && item.id === selectedTool.id"
      @clicked="selectedTool = item"
    />
  </ItemGroup>

  <ItemGroup title="SELECT LOCATION" :loading="loadingItems" :empty="allClaims.length === 0">
    <Item
      v-for="item in allClaims"
      :key="item.id"
      :item="item"
      :hideAmount="true"
      :selected="selectedClaim && item.id === selectedClaim.id"
      @clicked="selectedClaim = item"
    />
  </ItemGroup>

  <div class="flex flex-row justify-center">
    <Butt :disabled="!canMine" @clicked="mine(selectedClaim, selectedTool)">
      {{ canMine ? 'Mine' : 'Select tool and location' }}
    </Butt>
  </div>

  <Notice v-if="miningSubmitted">
    <div v-if="miningFailed">Failed :(</div>
    <div v-else-if="isMining && miningSubmitted">Hitting some rocks...</div>
    <div v-else-if="isMining">Sending transaction...</div>
    <div v-else-if="miningSuccess">
      Success!
      <br />

      <a
        :href="`https://testnet.snowtrace.io/tx/${miningTx}`"
        target="_blank"
        class="underline text-gray-600"
      >
        View transaction
      </a>
    </div>
  </Notice>
</template>

<script>
import { callMethod } from '../../contracts';
import { mapGetters, mapState } from 'vuex';
import Item from '../Item.vue';
import ItemGroup from '../ItemGroup.vue';

export default {
  name: 'Inventory',

  components: { Item, ItemGroup },

  data() {
    return {
      showMiningModal: false,
      selectedTool: null,
      selectedClaim: null,
      miningContract: null,

      isMining: false,
      miningSubmitted: false,
      miningSuccess: false,
      miningFailed: false,
      miningTx: '',
    };
  },

  async mounted() {
    // this.loadClaims();
  },

  computed: {
    ...mapState(['loadingItems']),
    ...mapGetters(['allItems', 'allTools', 'allClaims']),

    canMine() {
      return this.selectedClaim && this.selectedTool;
    },
  },

  methods: {
    openMiningModal() {
      this.showMiningModal = true;
      this.isMining = false;
      this.miningSuccess = false;
      this.miningSubmitted = false;
      this.miningFailed = false;
      this.miningTx = '';
    },

    closeCraftModal() {
      this.showMiningModal = false;
    },

    async mine(claim, tool) {
      console.log({ claim, tool });
      this.isMining = true;

      try {
        const transaction = await callMethod('mining', 'mine', {
          claimTokenId: claim.attributes.token_id,
          toolTokenId: tool.attributes.token_id,
        });

        this.miningSubmitted = true;

        const result = await transaction.wait();

        console.log(result);

        if (result.status === 1) {
          this.miningSuccess = true;
          this.miningTx = result.transactionHash;
          this.selectedTool = null;
          this.selectedClaim = null;
        } else {
          throw Error(result);
        }
      } catch (err) {
        this.miningFailed = true;
        console.error('Failed to craft', err);
      }

      this.isMining = false;
    },
  },
};
</script>
